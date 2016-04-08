<?php
	session_start();
	require 'connect.php';
?>
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<link rel="icon" href="/pics/favicon.ico">
    <title>Fussball-Wetten</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/bootstrap-theme.min.css" rel="stylesheet">

		<!--Eigenes Stylesheet-->
		<link rel="stylesheet" href="/css/main.css" type="text/css">
  </head>
  <body>
	 <!-- Navigation aus Bootstrap-->
	<nav class="navbar navbar-default navbar-custom navbar-fixed-top">
		<div class="container-fluid">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header page-scroll">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="index.php">Fussball-Wetten</a>
			</div>

			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav navbar-right">
					<li>
						<a href="index.php">Home</a>
					</li>
					<li>
						<a href="ranking.php">Rangliste</a>
					</li>
					<?php
					if(!isset($_SESSION['mail'])){
					?>
					<li>
						<button class="btn btn-info center-block" type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#loginModal">
							Login
						</button>
					</li>
					<li>
						<button class="btn btn-info center-block" type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#registerModal">
							Register
						</button>
					</li>
					<?php
					} else
						echo "<li><a href='logout.php'>".$_SESSION['mail']."</a></li>";
					?>
				</ul>
			</div>
		</div>
	</nav>

	<!--Content für den User oder Admin, unterscheidung mittels PHP-Login-->
	<div class="container" id="homeContent">
		<?php if(isset($_SESSION['mail']) && $_SESSION['isAdmin']) { ?>
			<div class="row">
				<div class="col-md-12">
					<div id="adminContent">
						<!--Button und Formular um ein Turnier zu erstellen-->
						<button id="btnturnierErstellen" href="#turnierErstellen" class="btn btn-default btn-block" data-toggle="collapse">Turnier erstellen</button>
						<br style="line-height:50px" />
						<!--Turnier erstellen-->
						<div id="turnierErstellen" class="collapse">
							<div class="row">
								<div class="col-md-12">
									<div id="turnierErstellenCreate">
										<!--Formular um Turnier zu erstellen-->
										<form class="form-horizontal" role="form" id="turnierErstellenCreateForm" method="POST">
										 <div class="form-group">
											 <label class="control-label col-sm-2" for="text">Name:</label>
											 <div class="col-sm-10">
												 <input type="text" class="form-control" id="turnierNameEingeben" placeholder="Turniername eingeben" required>
											 </div>
										 </div>
										 <div class="form-group">
											 <label class="control-label col-sm-2" for="text">Jahr:</label>
											 <div class="col-sm-10">
												 <input type="number" min="2016" class="form-control" id="turnierJahrEingeben" placeholder="In welchem Jahr findet das Turnier statt?" required>
											 </div>
										 </div>
										 <div class="form-group">
											 <label class="control-label col-sm-2" for="text">Typ:</label>
											 <div class="col-sm-10">
												 <select id="turnierTypEingeben">
													 <option>EM</option>
													 <option>WM</option>
												 </select>
											 </div>
										 </div>
										 <div class="form-group">
											 <div class="col-sm-offset-2 col-sm-10">
												 <button type="submit" class="btn btn-default">erstellen</button>
											 </div>
										 </div>
										</form>
									</div>
								</div>
							</div>
						</div>

						<!--Gruppe erstellen-->
						<div class="row">
							<div class="col-md-12">
								<button id="btnGruppenVerwalten" href="#gruppenVerwalten" class="btn btn-default btn-block" data-toggle="collapse">Gruppen verwalten</button>
								<br style="line-height:50px" />
								<div id="gruppenVerwalten" class="collapse">
									<div class="row">
										<div class="col-md-12">
											<div id="aktuelleGruppen">
												test
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		<?php }elseif (isset($_SESSION['mail']) && !$_SESSION['isAdmin']) { ?>
			<div class="row">
				<div class="col-md-12">
					<div id="welcomeMessage">
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div id="userContent">
					</div>
				</div>
			</div>
	<?php }else{ ?>
		<div id="homeContentGuest">
			<h1>Herzlich Wilkommen</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	<?php } ?>
	<br style="line-height:50px" />
	<div class="row">
		<div class="col-md-12">
			<div id="aktivesTurnier">
			</div>
		</div>
	</div>
	</div>

	<!-- LoginModal -->
	<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="meinModalLabel">
	  <div class="modal-dialog" role="document">
		<div class="modal-content">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Schliessen"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="meinModalLabel">Login</h4>
		  </div>
		  <div class="modal-body">
			<form method="POST" action="login.php "role="form">
				<div class="form-group">
				  <label for="email">Email:</label>
				  <input type="email" class="form-control" id="loginEmail" name="loginEmail" required="required" placeholder="Email-Adresse eingeben">
				</div>
				<div class="form-group">
				  <label for="pwd">Passwort:</label>
				  <input type="password" class="form-control" id="loginPassword" name="loginPassword" required="required" placeholder="Passwort eingeben">
				</div>
				<button type="submit" name="loginSubmit" id="loginSubmit" class="btn btn-info">Login</button>
			  </form>
		  </div>
		  <div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal">close</button>
		  </div>
		</div>
	  </div>
	</div>

	<!-- RegisterModal -->
	<div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="meinModalLabel">
	  <div class="modal-dialog" role="document">
		<div class="modal-content">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Schliessen"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="meinModalLabel">Login</h4>
		  </div>
		  <div class="modal-body">
			<form method="POST" action="register.php" role="form">
				<div class="form-group">
				  <label for="text">Vorname:</label>
				  <input type="text" class="form-control" name="RegisterVorname" required="required" placeholder="Vorname eingeben">
				</div>
				<div class="form-group">
				  <label for="text">Nachname:</label>
				  <input type="text" class="form-control" name="RegisterNachname" required="required" placeholder="Nachname eingeben">
				</div>
				<div class="form-group">
				  <label for="email">Email:</label>
				  <input type="email" class="form-control" name="RegisterEmail" required="required" placeholder="Email-Adresse eingeben">
				</div>
				<div class="form-group">
				  <label for="pwd">Password:</label>
				  <input type="password" class="form-control" name="RegisterPw" required="required" placeholder="Passwort eingeben">
				</div>
				<div class="form-group">
				  <label for="pwd">Passwort wiederholen:</label>
				  <input type="password" class="form-control" name="RegisterPw2" required="required" placeholder="Passwort wiederholen">
				</div>
				<button name="RegisterSubmit" type="submit" class="btn btn-info">Register</button>
			  </form>
		  </div>
		  <div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal">close</button>
			<!--<button type="button" class="btn btn-primary">save changes</button>-->
		  </div>
		</div>
	  </div>
	</div>

		<!-- Einbinden der Skripts -->
	  <!--<script type="text/javascript" src="http://code.jquery.com/jquery-2.2.1.min.js"></script>-->
		<script type="text/javascript" src="js/jquery-2.2.1.min.js"></script>
		<script>
    	var loggedIn = <?php echo isset($_SESSION['is_logged']) && $_SESSION['is_logged'] == 'yes' ? 'true' : 'false'; ?>;
		</script>
	  <script type="text/javascript" src="js/script.js"></script>
	  <script src="js/bootstrap.min.js"></script>
  </body>
</html>
