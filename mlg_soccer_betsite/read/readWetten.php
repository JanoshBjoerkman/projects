<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $sql = "SELECT User_ID FROM user WHERE Email = '".$_SESSION['mail']."'";
  $uID = mysqli_fetch_row(mysqli_query($db_link, $sql));
  $temp = array();
  $resultGames = array();
  $sql = "SELECT * FROM user
          LEFT JOIN wette ON user.User_ID = wette.User_ID
          WHERE user.User_ID = '$uID[0]'";

  $temp = mysqli_query($db_link, $sql);
  $index = 0;
  while($zeile = mysqli_fetch_assoc($temp))
  {
    $resultGames[$index] = $zeile;
    $index = $index + 1;
  };

  echo json_encode($resultGames);
?>
