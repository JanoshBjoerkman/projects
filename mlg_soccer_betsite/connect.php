<?php
	//Variablen f�r DB-Verbindung
	$servername = "localhost";
	$username = "root";
	$password = "admin";

	//Erstellt Verbindung
	$conn = mysqli_connect($servername, $username, $password);

	//�berpr�ft ob Verbidnung vorhanden ist, wenn nicht: Abbruch
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}

	//Erstellt DB mit UTF8 Codierung
	$sql = 'CREATE DATABASE IF NOT EXISTS fussballwetten CHARACTER SET utf8 COLLATE utf8_general_ci';
	$result = mysqli_query($conn, $sql)
	  or die("Failed to create database: " . mysql_error());

	//link f�r connection
	$db_link = mysqli_connect($servername, $username, $password, "fussballwetten");

	//user
	$sql = 'CREATE TABLE IF NOT EXISTS user(
	User_ID int NOT NULL AUTO_INCREMENT,
	Vorname varchar(50) NOT NULL,
	Nachname varchar(50) NOT NULL,
	Punkte int,
	offenerBetrag int,
	bereitsBezahlt int,
	Email varchar(50) NOT NULL UNIQUE,
	Password varchar(255) NOT NULL,
	Adminrechte boolean NOT NULL DEFAULT 0,
	PRIMARY KEY (User_ID)
	)';
	mysqli_query($db_link, $sql);

	//wette
	$sql = 'CREATE TABLE IF NOT EXISTS wette(
	Wette_ID int NOT NULL AUTO_INCREMENT,
	User_ID int,
	PRIMARY KEY (Wette_ID),
	FOREIGN KEY (User_ID) REFERENCES user(User_ID)
	)';
	mysqli_query($db_link, $sql);

	//gruppe
	$sql = 'CREATE TABLE IF NOT EXISTS gruppe(
	Gruppe_ID int NOT NULL AUTO_INCREMENT,
	Gruppenname varchar(50),
	PRIMARY KEY (Gruppe_ID)
	)';
	mysqli_query($db_link, $sql);

	//team
	$sql = 'CREATE TABLE IF NOT EXISTS team(
	Team_ID int NOT NULL AUTO_INCREMENT,
	Land varchar(50) NOT NULL,
	Gruppe_ID int,
	PRIMARY KEY (Team_ID),
	FOREIGN KEY (Gruppe_ID) REFERENCES gruppe(Gruppe_ID)
	)';
	mysqli_query($db_link, $sql);

	//spiel
	$sql = 'CREATE TABLE IF NOT EXISTS spiel(
	Spiel_ID int NOT NULL AUTO_INCREMENT,
	Spiel_Nr int,
	Datum DATE NOT NULL,
	Home_Team varchar(50),
	Guest_Team varchar(50),
	Home_Goals int,
	Guest_Goals int,
	Winner varchar(50),
	PRIMARY KEY (Spiel_ID)
	)';
	mysqli_query($db_link, $sql);

	//tip
	$sql = 'CREATE TABLE IF NOT EXISTS tip(
	Tip_ID int NOT NULL AUTO_INCREMENT,
	Home_Team varchar(50),
	Guest_Team varchar(50),
	Winner varchar(50),
	Spiel_ID int,
	Wette_ID int,
	PRIMARY KEY (Tip_ID),
	FOREIGN KEY (Spiel_ID) REFERENCES spiel(Spiel_ID),
	FOREIGN KEY (Wette_ID) REFERENCES wette(Wette_ID)
	)';
	mysqli_query($db_link, $sql);

	//spiel_team
	$sql = 'CREATE TABLE IF NOT EXISTS spiel_team(
	Spiel_ID int,
	Team_ID int,
	FOREIGN KEY (Spiel_ID) REFERENCES spiel(Spiel_ID),
	FOREIGN KEY (Team_ID) REFERENCES team(Team_ID)
	)';
	mysqli_query($db_link, $sql);
?>
