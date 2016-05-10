<?php
  session_start(); // Session starten
  require '../connect.php'; // verbindung zu DB
  header("Content-Type: text/html;charset=UTF-8"); // UTF8 einstellen
  $temp = array();
  $resultSpiel = array();

  $sql = "SELECT gruppe.Gruppe_ID, gruppe.Gruppenname,
                 spiel.Spiel_ID, spiel.Gruppe_ID, spiel.Datum,
                 spiel.Team1_ID, spiel.Team2_ID,
                 spiel.Team1_goals, spiel.Team2_goals,
                 spiel_team.Spiel_ID, spiel_team.Team_ID,
                 team.Team_ID, team.Land
            FROM gruppe
            JOIN spiel ON gruppe.Gruppe_ID = spiel.Gruppe_ID
            JOIN spiel_team ON spiel.Spiel_ID = spiel_team.Spiel_ID
            JOIN team ON spiel_team.Team_ID = team.Team_ID
          ORDER BY spiel.Datum";
  $temp = mysqli_query($db_link, $sql);
  $index = 0;
  while($zeile = mysqli_fetch_assoc($temp))
  {
    $resultSpiel[$index] = $zeile;
    $index = $index + 1;
  };
  echo json_encode($resultSpiel);
?>
