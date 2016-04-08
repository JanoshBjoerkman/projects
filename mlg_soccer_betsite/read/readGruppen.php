<?php
  session_start();
  require '../connect.php';

  $resultGruppen = array();
  $sql = "SELECT * FROM gruppe";
  $temp = mysqli_query($db_link, $sql);
  while($row=mysqli_fetch_assoc($temp))
  {
    $resultGruppen[] = $row;
  };

  echo json_encode($resultGruppen);


?>
