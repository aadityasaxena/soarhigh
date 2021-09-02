<?php

$host = "localhost";
$user = "root";
$pass = "";
$db = "test";



$mysqli = new mysqli($host, $user, $pass, $db);
if ($mysqli -> connect_error) {
    exit('Could not connect');
}

$sql1= "SELECT * FROM user WHERE id=(SELECT max(id) FROM user)";
$result1 = mysqli_query($mysqli, $sql1) or die(mysqli_error($mysqli));
$user = $result1->fetch_assoc();
$user_json = json_encode($user);
$id = $user['id'];
$sql2 = "SELECT * FROM `question_answer` WHERE `user_id` = $id ORDER BY `id` ASC";
$result2 = mysqli_query($mysqli, $sql2) or die(mysqli_error($mysqli));
$count = mysqli_num_rows($result2);
// $rows = $result->fetch_assoc();
// $result -> fetch_all(MYSQLI_ASSOC);
$response1 = array();
$response2 = array();
$counter= 1;

echo "[";
while ($response2 = $result2->fetch_assoc()) {
    if($counter==$count)
    {
        echo json_encode($response2);
        echo ",".$user_json."]";
    }
    else{
        echo json_encode($response2).",";
        $counter++;
    }
}
// echo json_encode($response2);


// array_push($response,$row['response']);
//https://localhost/soar-vision/retrieve.php
