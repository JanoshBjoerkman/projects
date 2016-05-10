<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $sql = "DELETE FROM wette WHERE Wette_ID='".$_GET['id']."'";
  mysqli_query($db_link, $sql);
?>
