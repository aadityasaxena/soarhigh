<?php

$country = strval($_GET['c']);
$domain = strval($_GET['d']);


$host = "localhost";
$user = "root";
$pass = "";
$db = "test";


$counter1 = 0;
$counter2 = 0;
$sumlaunch = 0;
$suminvest = 0;
$avginvestcountry = 0;
$avginvestdomain = 0;
$avglaunchcountry = 0;
$avglaunchdomain = 0;


$conn = mysqli_connect($host, $user, $pass, $db);

$query1 = "SELECT `launch_index`, `invest_index` FROM `benchmark` WHERE country= '" . $country . "'";
$query2 = "SELECT `launch_index`, `invest_index` FROM `benchmark` WHERE domain= '" . $domain . "'";
$run = mysqli_query($conn, $query1) or die(mysqli_error($conn));
if (mysqli_num_rows($run) > 0)
{
    while($row = mysqli_fetch_assoc($run)){
        $sumlaunch+=$row['launch_index'];
        $suminvest+=$row['invest_index'];
        $counter1+=1;
    }
    $avglaunchcountry = $sumlaunch/$counter1;
    $avginvestcountry = $suminvest/$counter1;
}


$run2 = mysqli_query($conn, $query2) or die(mysqli_error($conn));
if(mysqli_num_rows($run2) > 0)
{
    while ($row2 = mysqli_fetch_assoc($run2)) {
        $domainlaunch += $row2['launch_index'];
        $domaininvest += $row2['invest_index'];
        $counter2 += 1;
    }
    $avglaunchdomain = $domainlaunch / $counter2;
    $avginvestdomain = $domaininvest / $counter2;
}


echo '[{"avglaunchcountry":"'.$avglaunchcountry.'","avglaunchdomain":"'.$avglaunchdomain.'","avginvestdomain":"'.$avginvestdomain.'","avginvestcountry":"'.$avginvestcountry.'","avginvestdomain":"'.$avginvestdomain.'"}]';
