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
    <link href="css/bootstrap.css" rel="stylesheet">
		<link href="css/bootstrap-theme.css" rel="stylesheet">
		<link href="fonts/glyphicons-halflings-regular.ttf" rel="application/x-font-ttf">
		<link href="css/bootstrap-switch.css" rel="stylesheet">
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
						<button id="btnturnierVerwalten" href="#turnierVerwalten" class="btn btn-default btn-block" data-toggle="collapse">Turnier verwalten</button>
						<br style="line-height:40px" />
						<!--Turniere verwalten-->
						<div id="turnierVerwalten" class="collapse">
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
									<br style="line-height:40px" />
								</div>
							</div>
							<!--Turnier Übersicht-->
							<div class="row">
								<div class="col-md-12">
									<div id="turnierUebersicht">
										<h4>Aktuelles Turnier:</h4>
										<div id="aktuelleTurniere">
										</div>
									</div>
									<br style="line-height:40px" />
								</div>
							</div>
						</div>
						<!--Gruppenverwaltung-->
						<div class="row">
							<div class="col-md-12">
								<button id="btnGruppenVerwalten" href="#gruppenVerwalten" class="btn btn-default btn-block" data-toggle="collapse">Gruppen verwalten</button>
								<br style="line-height:40px" />
								<div id="gruppenVerwalten" class="collapse">
									<div class="row">
										<!--Gruppenübersicht-->
										<div class="col-md-3">
											<h4>Übersicht aller Gruppen:</h4>
											<div id="aktuelleGruppen">
											</div>
										</div>
										<div class="col-md-2">
										</div>
										<!--Gruppen erstellen-->
										<div class="col-md-7">
											<h4>Gruppe erstellen:</h4>
											<div id="gruppenErstellen">
												<form class="form-horizontal" role="form" id="gruppeErstellenCreateForm" method="GET">
												 <div class="form-group">
													 <label class="control-label col-sm-2" for="text">Bezeichnung:</label>
													 <div class="col-sm-10">
														 <input type="text" class="form-control" id="gruppeBezeichnungEingeben" placeholder="Gruppenbezeichnung eingeben" required>
													 </div>
												 </div>
												 <div class="form-group">
													 <div class="col-sm-offset-2 col-sm-10">
														 <button type="submit" class="btn btn-primary">erstellen</button>
													 </div>
												 </div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!--Teamverwaltung-->
						<div class="row">
							<div class="col-md-12">
								<button id="btnTeamsVerwalten" href="#teamsVerwalten" class="btn btn-default btn-block" data-toggle="collapse">Teams verwalten</button>
								<br style="line-height:40px" />
								<div id="teamsVerwalten" class="collapse">
									<div class="row">
										<div class="col-md-4">
											<h4>Übersicht aller Teams:</h4>
											<div id="aktuelleTeams">
											</div>
										</div>
										<div class="col-md-2">
										</div>
										<div class="col-md-6">
											<h4>Team erstellen:</h4>
											<div id="teamErstellen">
												<form class="form-horizontal" role="form" id="teamErstellenForm" method="GET">
												 <div class="form-group">
													 <label class="control-label col-sm-2" for="text">Land</label>
													 <div class="col-sm-10">
														 <input type="text" class="form-control" id="teamErstellenLand" placeholder="Land eingeben" required>
													 </div>
												 </div>
												 <div class="form-group">
													<label class="control-label col-sm-2" for="teamErstellenFormDropdown">Gruppe</label>
													<div class="col-sm-2">
													 	<select class='form-control' id='teamErstellenFormDropdown'></select>
													</div>
												 </div>
												 <div class="form-group">
													 <div class="col-sm-offset-2 col-sm-10">
														 <button type="submit" class="btn btn-primary">erstellen</button>
													 </div>
												 </div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!--Vorrunden-->
						<div class="row">
							<div class="col-md-12">
								<button id="btnSpieleVerwalten" href="#spieleVerwalten" class="btn btn-default btn-block" data-toggle="collapse">Spiele verwalten</button>
								<br style="line-height:40px" />
								<div id="spieleVerwalten" class="collapse">
									<div class="row">
										<div class="col-md-10">
											<div id="spielErstellen">
												<form class="form-horizontal" role="form" id="spielErstellenForm">
												 <div class="form-group">
													 <label class="control-label col-sm-2" for="spielErstellenFormDropdown1">Team 1:</label>
													 <div class="col-sm-2">
														 <select class='form-control' id='spielErstellenFormDropdown1' required></select>
													 </div>
													 <label class="control-label col-sm-2" for="spielErstellenFormDatum">Datum:</label>
													 <div class="col-sm-2">
														 <input type="text" class="form-control" id="spielErstellenInputDatum" placeholder="z.B: 14.04.2016" required>
													 </div>
													 <label class="control-label col-sm-2" for="spielErstellenFormDropdown2">Team 2:</label>
													 <div class="col-sm-2">
														 <select class='form-control' id='spielErstellenFormDropdown2' required></select>
													 </div>
												 </div>
												 <div class="form-group">
														 <button type="submit" class="btn btn-primary" id="btnErstellen">erstellen</button>
												 </div>
												</form>
												<div class="alert alert-danger" id="alertSpielErstellen">
													<strong>Fehler!</strong> Bitte folgendes Format verwenden: DD.MM.YYYY
												</div>
												<div class="alert alert-success" id="successSpielErstellen">
												  <strong>Success!</strong> Spiel erfolgreich eingetragen.
												</div>
											</div>
										</div>
									</div>
									<!--Übersicht Gruppen A-B-->
									<div class="row">
										<div class="col-md-6">
											<div id="vorrundenUebersichtGruppeA">
												<table class="table table-striped">
												</table>
											</div>
										</div>
										<div class="col-md-6">
											<div id="vorrundenUebersichtGruppeB">
											</div>
										</div>
									</div>
										<!--Gruppen C-D-->
									<div class="row">
										<div class="col-md-6">
											<div id="vorrundenUebersichtGruppeC">
											</div>
										</div>
										<div class="col-md-6">
											<div id="vorrundenUebersichtGruppeD">
											</div>
										</div>
									</div>
									<!--Gruppen E-F-->
									<div class="row">
										<div class="col-md-6">
											<div id="vorrundenUebersichtGruppeE">
											</div>
										</div>
										<div class="col-md-6">
											<div id="vorrundenUebersichtGruppeF">
											</div>
										</div>
									</div>
									<!--Gruppen G-H-->
									<div class="row">
										<div class="col-md-6">
											<div id="vorrundenUebersichtGruppeG">
											</div>
										</div>
										<div class="col-md-6">
											<div id="vorrundenUebersichtGruppeH">
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
		<script src="js/bootstrap.js"></script>
		<script src="js/bootstrap-switch.js"></script>
	  <script type="text/javascript" src="js/script.js"></script>
		<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
  </body>
</html>
