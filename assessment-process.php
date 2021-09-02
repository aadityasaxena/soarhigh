<?php


use \PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/vendor/convertapi/convertapi-php/lib/ConvertApi/autoload.php';


use \ConvertApi\ConvertApi;



$csv = file("documents/MiniAssessment.csv");
$qcount = count($csv) - 1;
echo $qcount;


if (!empty($qcount)) {
    $radio = array();
    $q = array();
    for ($i = 1; $i <= $qcount; $i++) {
        array_push($radio, "radio${i}");
    }

    $host = "localhost";
    $user = "root";
    $pass = "";
    $db = "test";



    $conn = mysqli_connect($host, $user, $pass, $db);

    for ($i = 0; $i < $qcount; $i++) {
        $q[$i] = $_POST["" . $radio[$i] . ""];
    }

    if (isset($_POST['submit'])) {
        $name = $_POST['name'];
        $startup_name  = $_POST['startup-name'];
        $email = $_POST['email'];
        $domain = $_POST['domain'];
        $country = $_POST['country'];
        $stage = $_POST['stage'];
        $funds = $_POST['funds'];
        $date = date("Y-m-d");

        $query = "INSERT INTO `user`(`name`, `startup_name`, `email`, `domain`, `country`, `stage`, `funds`,`date`) VALUES ('$name','$startup_name','$email','$domain','$country','$stage','$funds', '$date')";
        $run = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $user_id = mysqli_insert_id($conn);
        echo $user_id;


        $stmt = $conn->prepare("INSERT INTO `question_answer`(`user_id`, `question`, `response`) VALUES (?,?,?)");
        $stmt->bind_param('iss', $user_id, $question, $response);

        for ($i = 0; $i < $qcount; $i++) {
            $question = $radio[$i];
            $response = $q[$i];

            $stmt->execute();
        }
        $stmt->close();
        ConvertApi::setApiSecret('5uIgWvCQEqJdBSD7');
        $result = ConvertApi::convert(
            'pdf',
            [
                'Url' => 'http://www.soar-vision.great-site.net/soar-vision/documents/pdf.html',
                'FileName' => 'Startup Assessment Report ' . $user_id,
                'LoadLazyContent' => 'true',
                'ViewportWidth' => '595',
                'ViewportHeight' => '842',
                'PageSize' => 'a4',
                'MarginTop' => '3',
                'MarginRight' => '3',
                'MarginBottom' => '3',
                'MarginLeft' => '3',
            ],
            'web'
        );
        $result->saveFiles('./pdf');

        $filepath = './pdf/Startup Assessment Report ' . $user_id . '.pdf';
        if ($blob = fopen($filepath, 'rb')) {


            $pdf_query = "INSERT INTO `pdf_file`(`user_id`,`filename`) VALUES (?,?)";
            $pdf_query = $conn->prepare($pdf_query);
            $pdf_query->bind_param('ib', $user_id, $blob);

            $pdf_query->execute();
            $pdf_query->close();
        }



        require_once "./PHPMailer/PHPMailer.php";
        require_once "./PHPMailer/SMTP.php";
        require_once "./PHPMailer/Exception.php";

        $mail = new PHPMailer();

        //SMTP Settings
        $mail->isSMTP();
        $mail->Host = "smtp.gmail.com";
        $mail->SMTPAuth = true;
        $mail->Username = "techtest4444@gmail.com"; //enter you email address
        $mail->Password = 'abcd1234!@#$'; //enter you email password
        $mail->Port = 465;
        $mail->SMTPSecure = "ssl";

        //Email Settings
        $mail->isHTML(true);
        $mail->setFrom('techtest4444@gmail.com', 'Soar-Vision');
        $mail->addAddress($email); //enter you email address
        $mail->addBcc("vedantmisra4444@gmai.com");
        $mail->Subject = ("Your Startup Assessment Report");
        $mail->Body = "Dear ${name}, <br><br> Thank you for submitting your responses to our assessment questions. <br><br>Attached, please find a detailed report on your Startup's Launch and Investment Readiness.<br><br>May your venture soar high!<br><br>Regards,<br>Team Soar<br><br><strong>P.S If you would like to repeat your assessment, please click <a href='http://www.soar-vision.great-site.net/soar-vision/'>here</a>. Also, we have collected a set of resources and templates to move your startup along <a href='#'>here</a>.</strong>";
        $mail->AddAttachment($filepath);

        if ($mail->send()) {
            $status = "success";
            $response = "Email is sent!";
        } else {
            $status = "failed";
            $response = "Something is wrong: <br><br>" . $mail->ErrorInfo;
        }



        header("location:preview.html");
    }
}
