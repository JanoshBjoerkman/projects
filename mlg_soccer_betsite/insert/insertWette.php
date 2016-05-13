<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  if(isset($_SESSION['mail'])){
    $testUserList = mysqli_query($db_link, 'SELECT User_ID FROM user WHERE Email = \''.$_SESSION['mail'].'\';');
    $testUser = mysqli_fetch_row($testUserList);
    $uid = $testUser[0];

    $sql = "INSERT INTO wette VALUES (NULL, '$uid');";
    mysqli_query($db_link, $sql);
    $wid = mysqli_insert_id($db_link);
    $data = array("currentWette_ID" => "$wid");
    echo json_encode($data);
  }
?>
