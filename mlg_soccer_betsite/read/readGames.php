<?php
  session_start(); // Session starten
  require '../connect.php'; // verbindung zu DB
  header("Content-Type: text/html;charset=UTF-8"); // UTF8 einstellen
  $temp = array();
  $resultSpiel = array();
  $sql = "SELECT Spiel_Nr, Datum, Team1_ID, Team2_ID FROM spiel WHERE Spiel_Nr = '$sn' && Datum = '$dt' && Team1_ID = '$t1' && Team2_ID = '$t2';";
  $temp = mysqli_query($db_link, $sql);
  $index = 0;
  while($zeile = mysqli_fetch_assoc($temp))
  {
    $resultSpiel[$index] = $zeile;
    $index = $index + 1;
  };
?>

SELECT spiel.Spiel_ID, spiel.Team1_ID, spiel.Team2_ID, spiel_team.Spiel_ID, team.Team_ID, team.Land FROM spiel
JOIN spiel_team ON spiel.Spiel_ID = spiel_team.Spiel_ID
JOIN team ON spiel_team.Team_ID = team.Team_ID
