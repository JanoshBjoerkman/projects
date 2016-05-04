<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $land = $_GET['land'];
  //$gruppe = $_GET['gruppe'];
  $sql = "INSERT INTO team VALUES (NULL, '$land');";
  mysqli_query($db_link, $sql);
?>
