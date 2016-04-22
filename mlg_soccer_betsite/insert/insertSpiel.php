<?php
  session_start(); // Session starten
  require '../connect.php'; // verbindung zu DB
  header("Content-Type: text/html;charset=UTF-8"); // UTF8 einstellen
  $sn = $_GET['spielnr']; // Spielnummer
  $dt = $_GET['datum']; // Datum
  $t1 = $_GET['team1']; // Team1
  $t2 = $_GET['team2']; // team2
  // Daten in Tabelle spiel einfügen
  $sql = "INSERT INTO spiel VALUES (NULL, (SELECT Turnier_ID FROM turnier where Status = 1), '$sn', '$dt', $t1, $t2, NULL, NULL, NULL);"; // MySQL-Query vorbereiten
  mysqli_query($db_link, $sql); // obige Abfrage durchführen
  // Spiel mit Team1 verknüpfen
  $sql = "INSERT INTO spiel_team VALUES ((SELECT Spiel_ID FROM spiel WHERE Spiel_Nr = '$sn' && Datum = '$dt' && Team1_ID = '$t1' && Team2_ID = '$t2'), '$t1');";
  mysqli_query($db_link, $sql); // obige Abfrage durchführen
  // Spiel mit Team2 verknüpfen
  $sql = "INSERT INTO spiel_team VALUES ((SELECT Spiel_ID FROM spiel WHERE Spiel_Nr = '$sn' && Datum = '$dt' && Team1_ID = '$t1' && Team2_ID = '$t2'), '$t2');";
  mysqli_query($db_link, $sql); // obige Abfrage durchführen
?>
