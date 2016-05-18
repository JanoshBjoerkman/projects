<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $sid = $_GET['sid'];
  $t = $_GET['Toto'];
  $wid = $_GET['wid'];
  $sql = "INSERT INTO tip VALUES (NULL, NULL, NULL, '$t', '$sid', '$wid');";
  mysqli_query($db_link, $sql);
?>
