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
  <body id="createWette">
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
 						echo "<li><a  id='navbaritem' class='navbaritem' href='logout.php'>".$_SESSION['mail']."</a></li>";
 					?>
 				</ul>
 			</div>
 		</div>
 	</nav>

	<!--Wenn angemeldet, Content anzeigen, sonst auf index.php weiterleiten-->
	<?php
		if(isset($_SESSION['mail'])){
	 ?>
	 <!--Wette erstellen-->
	 <div class="container">
		 <div class="row">
       <div id="createWetteVorrunden" class="col-md-12">
        <div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteVorrundeA" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteVorrundeB" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteVorrundeC" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteVorrundeD" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteVorrundeE" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteVorrundeF" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteVorrundeG" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteVorrundeH" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteGruppeAF" class="col-md-8">
						<form class="form-horizontal container" role="form" id="FORMcreateWetteGruppeAF">
							<div class="row">
							 <div class="form-group col-md-12">
								 <label class="control-label col-sm-1" for="spielErstellenFormDropdown1">Team 1:</label>
								 <div class="col-sm-2">
									 <select class='form-control' id='spielErstellenFormDropdown1' required></select>
								 </div>
								 <label class="control-label col-sm-1" for="spielErstellenFormDropdown2">Team 2:</label>
								 <div class="col-sm-2">
									 <select class='form-control' id='spielErstellenFormDropdown2' required></select>
								 </div>
								</div>
							</div>
						</form>
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteGruppeVF" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteGruppeHF" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				<div class="row">
					<div class="col-md-2">
					</div>
          <div id="createWetteGruppeFINALE" class="col-md-8">
          </div>
					<div class="col-md-2">
					</div>
				</div>
				 <div class="row">
				 	<div class="col-md-4">
					</div>
					<div class="col-md-4">
							<button id="btnCreateWetteErstellen" class="btn btn-success btn-block">Wettschein abschicken</button>
							<button id="btnCreateWetteAbbrechen" class="btn btn-warning btn-block">Abbrechen</button>
					</div>
				 </div>
       </div>
		 </div>
	 </div>
	 <div class="loadingModal"></div>
	 <?php }else{
		 header('Location: index.php');
	 } ?>

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
