<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $sql = "UPDATE turnier SET Status=0 WHERE Turnier_ID='".$_GET['id']."'";
  mysqli_query($db_link, $sql);
?>
