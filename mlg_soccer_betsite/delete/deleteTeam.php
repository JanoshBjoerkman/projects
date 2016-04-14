<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $g_id = $_GET['id'];
  $sql = "DELETE FROM team WHERE Team_ID='".$g_id."'";
  mysqli_query($db_link, $sql);
?>
