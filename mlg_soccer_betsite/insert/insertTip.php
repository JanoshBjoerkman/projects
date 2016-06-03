<?php
  session_start();
  require '../connect.php';
  // check if teams are set
  if(isset($_GET['t1'])){
    $t1 = $_GET['t1'];
  }else{
    $t1 = 0;
  }
  if(isset($_GET['t2'])){
    $t2 = $_GET['t2'];
  }else{
    $t2 = 0;
  }
  // check if Tip exists
  if(isset($_GET['Toto'])){
    $t = $_GET['Toto'];
  }else{
    $t = 0;
  }

  $sid = $_GET['sid'];
  $wid = $_GET['wid'];
  $sql = "INSERT INTO tip VALUES (NULL, '$t1', '$t2', '$t', '$sid', '$wid');";
  mysqli_query($db_link, $sql);
?>
