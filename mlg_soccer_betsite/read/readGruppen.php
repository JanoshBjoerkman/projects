<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");

  $temp = array();
  $resultGruppen = array();
  $sql = "SELECT * FROM gruppe ORDER BY Gruppe_ID";
  $temp = mysqli_query($db_link, $sql);
  $index = 0;
  while($zeile = mysqli_fetch_assoc($temp))
  {
    $resultGruppen[$index] = $zeile;
    $index = $index + 1;
  };

  echo json_encode($resultGruppen);
?>
