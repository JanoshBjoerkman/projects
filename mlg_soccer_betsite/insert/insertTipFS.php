<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $t1 = $_GET['t1'];
  $t2 = $_GET['t2'];
  $gID = $_GET['gID'];
  $sNr = $_GET['sNr'];
  $wid = $_GET['w'];
  $sql = "INSERT INTO tipFS VALUES (NULL, '$t1', '$t2', '$gID', '$sNr', '$wid');";
  mysqli_query($db_link, $sql);
?>
