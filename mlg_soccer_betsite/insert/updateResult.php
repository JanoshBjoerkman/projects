<?php
  session_start(); // Session starten
  require '../connect.php'; // verbindung zu DB
  header("Content-Type: text/html;charset=UTF-8"); // UTF8 einstellen
  $id = $_GET['id']; // Spiel_ID
  $p1 = $_GET['pT1']; // Punkte Team1
  $p2 = $_GET['pT2']; // Punkte Team2

  // Daten in Tabelle spiel einfügen
  $sql = "UPDATE spiel SET Team1_goals = '$p1', Team2_goals = '$p2' WHERE Spiel_ID = '$id'"; // MySQL-Query vorbereiten
  mysqli_query($db_link, $sql); // obige Abfrage durchführen
?>
