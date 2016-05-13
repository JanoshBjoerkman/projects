<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $sid = $_GET['sid'];
  $t = $_GET['Toto'];
  $sql = "INSERT INTO tip VALUES (NULL, NULL, NULL, '$t', '$sid', 1);";
  mysqli_query($db_link, $sql);
?>
