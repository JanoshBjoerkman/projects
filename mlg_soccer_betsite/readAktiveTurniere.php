<?php
  session_start();
  require 'connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  
  $resultAktivesTurnier = array();
  $sql = "SELECT * FROM turnier WHERE Status = 1";
  $resultAktivesTurnier = mysqli_query($db_link, $sql);
  $arrayAktivesTurnier = mysqli_fetch_row($resultAktivesTurnier);

  echo json_encode($arrayAktivesTurnier);
?>
