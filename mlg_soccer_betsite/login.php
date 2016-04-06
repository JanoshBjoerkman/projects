<?php
	//Sessionstart + connect.php einbinden
	session_start();
	require 'connect.php';
	header("Content-Type: text/html;charset=UTF-8");
	
	//Check userdata (bei Übergabe)
	if (isset($_POST["loginEmail"]) && isset($_POST["loginPassword"]))
			{	
				//Alle User auslesen und jede Zeile 
				$liste = mysqli_query($db_link, 'SELECT * FROM user;');
				while($row = mysqli_fetch_object($liste))
						{
							if($_POST['loginEmail'] == $row->Email){
								if(sha1($_POST['loginPassword']) != $row->Password)
									die("Wrong password");
								else{
									$_SESSION['mail'] = $_POST['loginEmail'];
								}
							}
						}
						if($_SESSION['mail']==NULL){
							die("Unknown user");
						}
			}
	header('Location: index.php');
?> 