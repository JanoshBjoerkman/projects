<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $sn = $_GET['spielnr'];
  $dt = $_GET['datum'];
  $t1 = $_GET['team1'];
  $t2 = $_GET['team2'];
  $sql = "INSERT INTO spiel VALUES (NULL, (SELECT Turnier_ID FROM turnier where Status = 1), '$sn', '$dt', $t1, $t2, NULL, NULL, NULL);";
  mysqli_query($db_link, $sql);
?>
