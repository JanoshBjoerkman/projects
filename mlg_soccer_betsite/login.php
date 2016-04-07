<?php
	//Sessionstart + connect.php einbinden
	session_start();
	require 'connect.php';
	header("Content-Type: text/html;charset=UTF-8");

	//Check userdata (bei Übergabe)
	if (isset($_POST["loginEmail"]) && isset($_POST["loginPassword"]))
			{
				//Alle User auslesen und jede Zeile nach der Email durchsuchen
				$liste = mysqli_query($db_link, 'SELECT * FROM user;');
				while($row = mysqli_fetch_object($liste))
						{
							if($_POST['loginEmail'] == $row->Email) // Wenn in DB gefunden -> check password -> bei Erfolg $_Session['mail'] auf aktuelle Email setzten
							{
								if(sha1($_POST['loginPassword']) != $row->Password)
									die("Wrong password");
								else{
									$_SESSION['mail'] = $_POST['loginEmail'];
									//Hat der User Adminrechte? -> $_Session['isAdmin'] setzten (0 oder 1, sprich false OR true)
									$testAdminList = mysqli_query($db_link, 'SELECT Adminrechte FROM user WHERE Email = \''.$_POST['loginEmail'].'\';');
									$testAdmin = mysqli_fetch_row($testAdminList);
									$_SESSION['isAdmin'] = $testAdmin[0];
									if($_SESSION['isAdmin'])
										echo $_SESSION['isAdmin'];
								}
							}
						}
						if($_SESSION['mail']==NULL){
							die("Unknown user");
						}
			}
	header('Location: index.php');
?>
