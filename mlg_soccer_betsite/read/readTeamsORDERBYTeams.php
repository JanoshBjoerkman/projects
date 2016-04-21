<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");

  $temp = array();
  $resultTeams = array();
  $sql = "SELECT * FROM team LEFT JOIN gruppe ON team.Gruppe_ID = gruppe.Gruppe_ID ORDER BY team.Land";
  $temp = mysqli_query($db_link, $sql);
  $index = 0;
  while($zeile = mysqli_fetch_assoc($temp))
  {
    $resultTeams[$index] = $zeile;
    $index = $index + 1;
  };

  echo json_encode($resultTeams);
?>
