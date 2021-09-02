<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "test";

$conn = mysqli_connect($host, $user, $pass, $db);

use PHPMailer\PHPMailer\PHPMailer;



if(!empty($_POST['submit'])){

    

    if(!empty($_POST['name-2']) || !empty($_POST['email']) || !empty($_POST['phone']) || !empty($_POST['message'])){
        $name = $_POST['name-2'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];
        $msg = $_POST['message'];
        $subject = 'SOMEONE WANTS TO CONTACT YOU';
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: ${email}' . "\r\n";

        $query = "INSERT INTO `contact_us`(`name`, `email`, `phone`, `message`) VALUES ('$name', '$email', '$phone', '$msg')";
        $run = mysqli_query($conn, $query) or die(mysqli_error($conn));

        if($run){
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
            $mail->setFrom($email, $name);
            $mail->addAddress("techtest4444@gmail.com"); //enter you email address
            $mail->Subject = ("$email (WANTS TO CONTACT YOU)");
            $mail->Body = $msg;

            if ($mail->send()) {
                $status = "success";
                $response = "Email is sent!";
            } else {
                $status = "failed";
                $response = "Something is wrong: <br><br>" . $mail->ErrorInfo;
            }

            // exit(json_encode(array("status" => $status, "response" => $response)));
        }
        else{
            echo "Form not submitted";
        }
    }
    else{
        echo "all fields required";

    }
}

header("location:contact.php?success");
