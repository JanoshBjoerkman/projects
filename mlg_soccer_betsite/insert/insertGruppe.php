<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $bezeichnung = $_GET['bezeichnung'];
  $sql = "INSERT INTO gruppe VALUES (NULL, '$bezeichnung');";
  mysqli_query($db_link, $sql);
?>
