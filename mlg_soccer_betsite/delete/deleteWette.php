<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  $id = $_GET['id'];
  // $sql = "DELETE FROM wette WHERE Wette_ID='$id';";
  // $sql .= "UPDATE user SET offenerBetrag=offenerBetrag -10 WHERE User_ID = '$id';";
  // mysqli_multi_query($db_link, $sql);
  if(isset($_SESSION['mail'])){
    $testUserList = mysqli_query($db_link, 'SELECT User_ID FROM user WHERE Email = \''.$_SESSION['mail'].'\';');
    $testUser = mysqli_fetch_row($testUserList);
    $uid = $testUser[0];

    $sql = "DELETE FROM wette WHERE Wette_ID='$id'";
    if(mysqli_query($db_link, $sql)){
      $sql = "UPDATE user SET offenerBetrag = offenerBetrag -10 WHERE User_ID='$uid'";
      mysqli_query($db_link, $sql);
    }
  }
?>
