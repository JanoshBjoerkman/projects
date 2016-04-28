<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  date_default_timezone_set("Europe/Berlin");

  $name = $_POST["name"];
  $jahr = $_POST["jahr"];
  $typ = $_POST['typ'];
  $datum = date("Y");

  //turnier aktiv oder inaktiv setzten (wenn Jahr == aktuelles Jahr -> aktiv)
  if($datum == $jahr)
  {
    $status = 1;
  }else{
    $status = 0;
  }
  // Gruppen A-F existieren immer, egal ob EM oder WM -> vorbereiten
  $sql = "INSERT INTO gruppe VALUES (NULL, 'A');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'B');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'C');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'D');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'E');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'F');";
  // wenn Turnier eine WM ist -> Gruppen G & H hinzufügen
  if($typ == 'EM')
  {
    $typ = 1;
  }else{
    $typ = 2;
    $sql .= "INSERT INTO gruppe VALUES (NULL, 'G');";
    $sql .= "INSERT INTO gruppe VALUES (NULL, 'H');";
  }
  // jetzt noch alle Finalrunden einfügen
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'AF');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'VF');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'HF');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'FINALE');";
  $sql .= "INSERT INTO turnier VALUES (NULL, '$name', '$jahr', '$status', '$typ');";
  mysqli_multi_query($db_link, $sql);
?>
