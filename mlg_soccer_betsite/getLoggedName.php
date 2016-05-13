<?php
	//Sessionstart + connect.php einbinden
	session_start();
	require 'connect.php';
	header("Content-Type: text/html;charset=UTF-8");

  $liste = mysqli_query($db_link, 'SELECT * FROM user;');
  while($row = mysqli_fetch_object($liste))
      {
        if($_SESSION['mail'] == $row->Email)
        {
            $_SESSION['vorname'] = $row->Vorname;
        }
      }

  echo json_encode($_SESSION['vorname']);
?>
