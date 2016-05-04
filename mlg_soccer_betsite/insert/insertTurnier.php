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
  // Turniertyp prüfen
  if($typ == 'EM')
  {
    $typ = 1;
  }else{
    $typ = 2;
  }
  // Tunrier einfügen
  $sql = "INSERT INTO turnier VALUES (NULL, '$name', '$jahr', '$status', '$typ');";
  mysqli_query($db_link, $sql);

  // Turnier_ID von aktivem Turnier herausfinden
  $sql = "SELECT Turnier_ID FROM turnier where Status = 1";
  $result = mysqli_query($db_link, $sql);
  $tid = mysqli_fetch_row($result);

  // Gruppen A-F existieren immer, egal ob EM oder WM -> vorbereiten
  $sql = "INSERT INTO gruppe VALUES (NULL, 'A', '".$tid[0]."');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'B', '".$tid[0]."');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'C', '".$tid[0]."');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'D', '".$tid[0]."');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'E', '".$tid[0]."');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'F', '".$tid[0]."');";
  // wenn Turnier eine WM ist -> Gruppen G & H hinzufügen
  if($typ == 2)
  {
    $sql .= "INSERT INTO gruppe VALUES (NULL, 'G', '".$tid[0]."');";
    $sql .= "INSERT INTO gruppe VALUES (NULL, 'H', '".$tid[0]."');";
  }
  // jetzt noch alle Finalrunden einfügen
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'AF', '".$tid[0]."');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'VF', '".$tid[0]."');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'HF', '".$tid[0]."');";
  $sql .= "INSERT INTO gruppe VALUES (NULL, 'FINALE', '".$tid[0]."');";
  mysqli_multi_query($db_link, $sql);

?>
