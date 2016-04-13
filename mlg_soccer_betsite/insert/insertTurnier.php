<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  date_default_timezone_set("Europe/Berlin");

  $name = $_POST["name"];
  $jahr = $_POST["jahr"];
  $typ = $_POST['typ'];
  $datum = date("Y");
  //turnier aktiv oder inaktiv setzten (wenn Jahr == aktuelles Jahr -> aktiv)
  if($datum == $jahr)
  {
    $status = 1;
  }else{
    $status = 0;
  }

  if($typ == 'EM')
  {
    $typ = 1;
  }else{
    $typ = 2;
  }

  $sql = "INSERT INTO turnier VALUES (NULL, '$name', '$jahr', '$status', '$typ');";
  mysqli_query($db_link, $sql);
?>
