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
		<!--Eigenes Stylesheet-->
		<link rel="stylesheet" href="/css/main.css" type="text/css">
  </head>
  <body>
	 <!-- Navigation aus Bootstrap-->
	<nav class="navbar-default navbar-custom navbar-fixed-top topnav">
		<div class="container-fluid navbar" id="navbar">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header page-scroll">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" id="home" href="index.php">Fussball-Wetten</a>
			</div>

			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1s">
				<ul class="nav navbar-nav navbar-right" id="navbar-right">
					<li>
						<a id="navbaritem" class="navbaritem" href="index.php">Home</a>
					</li>
					<li>
						<a id="navbaritem" class="navbaritem" href="ranking.php">Rangliste</a>
					</li>
					<?php
					if(!isset($_SESSION['mail'])){
					?>
					<li>
						<button id="navbaritem" class="btn btn-success center-block btnlogin" type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#loginModal">
							Login
						</button>
					</li>
					<li>
						<button id="navbaritem" class="btn btn-success center-block btnlogout" type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#registerModal">
							Register
						</button>
					</li>
					<?php
					} else
						echo "<li><a  id='navbaritem' class='navbaritem' data-toggle='tooltip' title='Logout' href='logout.php'>".$_SESSION['mail']."</a></li>";
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
						<button id="btnturnierVerwalten" href="#turnierVerwalten" class="btn btn-block btnadmin" data-toggle="collapse">Turnier verwalten</button>
						<!--Turniere verwalten-->
						<div id="turnierVerwalten" class="collapse">
							<div class="row">
								<div class="col-md-5">
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
												 <button type="submit" class="btn btn-success">erstellen</button>
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
						<!--Teamverwaltung-->
						<div class="row">
							<div class="col-md-12">
								<button id="btnTeamsVerwalten" href="#teamsVerwalten" class="btn btn-block" data-toggle="collapse">Teams verwalten</button>
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
													 <div class="col-sm-offset-2 col-sm-10">
														 <button type="submit" class="btn btn-success">erstellen</button>
													 </div>
												 </div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!--Spiele verwalten-->
						<div class="row">
							<div class="col-md-12">
								<button id="btnSpieleVerwalten" href="#spieleVerwalten" class="btn btn-block" data-toggle="collapse">Spiele verwalten</button>
								<div id="spieleVerwalten" class="collapse">
									<div id="spielErstellen">
										<form class="form-horizontal container" role="form" id="spielErstellenForm">
											<div class="row">
											 <div class="form-group col-md-12">
												 <label class="control-label col-sm-1" for="spielErstellenFormDropdown1">Team 1:</label>
												 <div class="col-sm-2">
													 <select class='form-control' id='spielErstellenFormDropdown1' required></select>
												 </div>
												 <label class="control-label col-sm-1" for="spielErstellenFormDatum">Datum:</label>
												 <div class="col-sm-2">
													 <input type="text" class="form-control" id="spielErstellenInputDatum" placeholder="z.B: 14.04.2016" required>
												 </div>
												 <label class="control-label col-sm-1" for="spielErstellenFormDropdown2">Team 2:</label>
												 <div class="col-sm-2">
													 <select class='form-control' id='spielErstellenFormDropdown2' required></select>
												 </div>
												 <label class="control-label col-sm-1" for="spielErstellenGruppeDropdown">Gruppe:</label>
												 <div class="col-sm-1">
													<select class='form-control' id='spielErstellenGruppeDropdown' required></select>
												 </div>
												</div>
											</div>
											<div class="row">
												<div class="form-group col-md-12">
												</div>
											 	<div class="form-group">
													<button type="submit" class="btn btn-success" id="btnErstellen">erstellen</button>
												</div>
											</div>
										</form>
										<div class="alert alert-danger" id="alertSpielErstellen">
											<strong>Fehler!</strong> Bitte folgendes Format verwenden: DD.MM.YYYY
										</div>
										<div class="alert alert-success" id="successSpielErstellen">
											<strong>Success!</strong> Spiel erfolgreich eingetragen.
										</div>
									</div>
									<!--diverse Buttons-->
									<div class="row">
										<div class="col-md-12">
											<button type="button" class="btn btn-success" id="toggleVorrunden">Vorrunden</button>
										</div>
									</div>
									<!--Übersicht Gruppen A-B-->
									<div id="spielVorrundenUebersicht">
										<div class="row">
											<div class="col-md-12">
												<div id="spielUebersicht">
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col-md-6">
												<div id="vorrundenUebersichtGruppeA">
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
									<!--Gruppen AF-VF-->
									<div class="row">
										<div class="col-md-6">
											<div id="spielUebersichtGruppeAF">
											</div>
										</div>
										<div class="col-md-6">
											<div id="spielUebersichtGruppeVF">
											</div>
										</div>
									</div>
									<!--Gruppen HF-FINALE-->
									<div class="row">
										<div class="col-md-6">
											<div id="spielUebersichtGruppeHF">
											</div>
										</div>
										<div class="col-md-6">
											<div id="spielUebersichtGruppeFINALE">
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
						<button id="btnMeineWetten" href="#meineWetten" class="btn btn-block" data-toggle="collapse">Meine Wetten</button>
						<div id=meineWetten class="collapse">
							<div class="row">
								<div class="col-md-3" id="meineWettenUebersicht">
								</div>
								<div class="col-md-3">
								</div>
								<br style="line-height:40px" />
								<div class="col-md-3" id="meineWettenCreate">
									<button id="btnMeineWettenCreate" class="btn btn-success btn-block">Neuer Wettschein</button>
								</div>
							</div>
						</div>
						<div class="row linie" >
							<h3 class="titel-center">Info</h4>
								<div class="col-md-3">
									<dl>
										<dt>Preise:</dt>
										<dd>1. Rang 40%</dd>
										<dd>2. Rang 30%</dd>
										<dd>3. Rang 20%</dd>
										<dt>...</dt>
										<dd>10% für gemeinsamen Znüni</dd>
									</dl>
								</div>
								<div class="col-md-4">
									<p><strong>Getippt wird nach dem Toto-System:</strong></p>
									<p><strong>1</strong> - Erstgenannte Mannschaft gewinnt</p>
									<p><strong>X</strong> - unentschieden</p>
									<p><strong>2</strong> - Zweitgenannte Mannschaft gewinnt</p>
								</div>
								<div class="col-md-5">
									<p><strong>Bezahlung:</strong></p>
									<p>Ein Wettschein kostet 10.-</p>
									<p>Es kann nur Bar und direkt bei Erika Vollenweider, jeweils Montag - Mittwoch, bezahlt werden, vielen Dank für Ihr Verständis</p>
								</div>
						</div>
					</div>
				</div>
			</div>
	<?php }else{ ?>
		<div id="homeContentGuest">
			<div class="row">
				<div class="col-md-12">
					<h1>Fussballwetten</h1>
					<h5>provided by BERNINA IT</h5>
				</div
			</div>
		</div>
		<br style="line-height:50px" />
		<div class="row">
			<div class="col-md-12">
				<h3><a id="startcontent" data-toggle="modal" data-target="#registerModal">Jetzt registrieren und gewinnen!</a></h3>
			</div>
		</div>
	<?php } ?>
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
				<button type="submit" name="loginSubmit" id="loginSubmit" class="btn btn-success">Login</button>
			  </form>
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
			<h4 class="modal-title" id="meinModalLabel">Register</h4>
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
				<button name="RegisterSubmit" type="submit" class="btn btn-success">Register</button>
			  </form>
		  </div>
		</div>
	  </div>
	</div>

	<!--Spiel bearbeiten-->
  <div class="modal fade" id="editSpielModal" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Resultat bearbeiten</h4>
        </div>
        <div class="modal-body">
          <form role="form" id="editResultForm">
						<div class="form-group">
							<label for="editResultT1">Punkte Team1</label>
      				<input type="number" class="form-control" id="editResultT1">
						</div>
						<div class="form-group">
							<label for="editResultT2">Punkte Team2</label>
      				<input type="number" class="form-control" id="editResultT2">
						</div>
						<button type="submit" class="btn btn-success">speichern</button>
          </form>
        </div>
      </div>

		<!-- Einbinden der Skripts -->
	  <!--<script type="text/javascript" src="http://code.jquery.com/jquery-2.2.1.min.js"></script>-->
		<script type="text/javascript" src="js/jquery-2.2.1.min.js"></script>
		<script>
	  	var loggedIn = <?php echo isset($_SESSION['is_logged']) && $_SESSION['is_logged'] == 'yes' ? 'true' : 'false'; ?>;
		</script>
		<script src="js/bootstrap.js"></script>
		<!--<script src="js/bootstrap-switch.js"></script>-->
	  <script type="text/javascript" src="js/script.js"></script>
  </body>
</html>
