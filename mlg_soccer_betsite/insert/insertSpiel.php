<?php
  session_start(); // Session starten
  require '../connect.php'; // verbindung zu DB
  header("Content-Type: text/html;charset=UTF-8"); // UTF8 einstellen
  $dt = $_GET['datum']; // Datum
  $t1 = $_GET['team1']; // Team1
  $t2 = $_GET['team2']; // team2
  $g = $_GET['gruppe']; // Gruppe
  // Daten in Tabelle spiel einfügen
  $sql = "INSERT INTO spiel VALUES (NULL, '$g', '$dt', $t1, $t2, NULL, NULL, NULL);"; // MySQL-Query vorbereiten
  mysqli_query($db_link, $sql); // obige Abfrage durchführen
  $sid = mysqli_insert_id($db_link); // Spiel_ID von eingetragenem Spiel herausfinden
  // Spiel mit Team1 verknüpfen
  $sql = "INSERT INTO spiel_team VALUES ('$sid', '$t1');";
  mysqli_query($db_link, $sql); // obige Abfrage durchführen
  // Spiel mit Team2 verknüpfen
  $sql = "INSERT INTO spiel_team VALUES ('$sid', '$t2');";
  mysqli_query($db_link, $sql); // obige Abfrage durchführen
?>
