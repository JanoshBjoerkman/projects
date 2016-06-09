<?php
  session_start();
  require '../connect.php';
  header("Content-Type: text/html;charset=UTF-8");
  // uncomment code below to make it work in IE
  //$land = utf8_encode($_GET['land']);
  // ----------------------------------------------------------------------------
  // comment code below this to make it work in IE
  $land = preg_replace("/%u([0-9a-f]{3,4})/i","&#x\\1;",urldecode($_GET['land']));
  $land = html_entity_decode($land,null,'UTF-8');;
  // -----------------------------------------------------------------------------
  $sql = "INSERT INTO team VALUES (NULL, '$land');";
  mysqli_query($db_link, $sql);
?>
