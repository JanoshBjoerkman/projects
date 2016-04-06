<?php
	session_start();
	require 'connect.php';
	header("Content-Type: text/html;charset=UTF-8");

	//Check userdata
	if (isset($_POST["RegisterEmail"]) && isset($_POST["RegisterPw"]) && isset($_POST["RegisterPw2"]))
			{
				if($_POST['RegisterPw']==$_POST['RegisterPw2'])
				{
					$liste = mysqli_query($db_link, 'SELECT count(*) AS Existenz FROM user WHERE Email = \''.$_POST['RegisterEmail'].'\';');
					$row = mysqli_fetch_row($liste);
					if($row[0]==1){
						die("Dieser Benutzer existiert bereits.");
					}else{
						if(strlen($_POST['RegisterEmail']) > 50 || strlen($_POST['RegisterPw']) > 255){
							echo "Email-Adresse oder Passwort zu lang.";
						}else{
							$sql = "INSERT INTO user VALUES (NULL, '".$_POST['RegisterVorname']."', '".$_POST['RegisterNachname']."', 0, 0, 0, '".$_POST['RegisterEmail']."', '".sha1($_POST['RegisterPw'])."', 0);";
							mysqli_query($db_link, $sql);
							$_SESSION['mail'] = $_POST['RegisterEmail'];
							header('Location: index.php');
						}
					}
				}else
					die("Wrong passwords");
			}
?>
