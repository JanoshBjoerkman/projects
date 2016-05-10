<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $s_id = $_GET['id'];
  $sql = "DELETE FROM spiel WHERE Spiel_ID='".$s_id."'";
  mysqli_query($db_link, $sql);
?>
