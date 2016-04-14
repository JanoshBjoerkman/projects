<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");

  $temp = array();
  $resultTurniere = array();
  $sql = "SELECT * FROM turnier LEFT JOIN turniertyp ON turnier.Typ_ID = turniertyp.Typ_ID WHERE turnier.Status = 1";
  $temp = mysqli_query($db_link, $sql);
  $index = 0;
  while($zeile = mysqli_fetch_assoc($temp))
  {
    $resultTurniere[$index] = $zeile;
    $index = $index + 1;
  };

  echo json_encode($resultTurniere);
?>
