/*
  Autor:              Janosh Björkman
  Letzte Änderung:    22.04.2016
  Projekt:            Fussballwetten-Online

  Kleine Info:        jQuery ist der Grund, wieso diese Webseite nicht neu geladen wird, obwohl man Änderungen in der Datenbank
                      machen kann und diese auch automatisch aktuell gehalten werden. Alle Aufrufe von PHP-Seiten innerhalb dieses
                      Scripts geschehen ohne dass der User etwas mitbekommt, Stichwort "dynamisch". Kommentare meinerseits werden nur
                      fürs grobe Verständis & zur Übersicht gemacht. Für ausführliche Beschreibungen der vorkommenden Funktionen besuche
                      folgende Website: http://www.w3schools.com/jquery/
                      oder nutze Google :P
*/

//Initialisierung der Website, wird nur einmal ausgeführt (sobald die das komplette Dokument (Webseite) geladen ist)
$(document).ready(function(){
    $('#homeContent').ready(showAktiveTurniere);  //Meldung für den User ob ein Turnier aktiv ist
    $('#successSpielErstellen').hide(); // Admin-Alert verstecken
    $('#alertSpielErstellen').hide(); // Admin-Alert verstecken
    // Willkommensnachricht (nur für User)
    $('#welcomeMessage').ready(function(){
        // AJAX-Call um dynamisch herauszufinden ob ein User angemeldet ist
        $.ajax({
          url:"./getLoggedName.php",
          data: "",
          dataType: 'json',
          success: function(data){
            var userVorname = data;
            // wenn ein User angemeldet ist, Willkommensnachricht einblenden
            if(!userVorname == '')
            {
              $('#welcomeMessage').hide();
              $('#welcomeMessage').html("<h3>Hallo "+userVorname+".</h3>"); // HTML im noch versteckten div(#welcomeMessage) vorbereiten
              $('#welcomeMessage').fadeIn(1000).fadeOut(1000); // Willkommensnachricht einblenden: fadeIn -> 1sek, dann fadeOut 1sek
            } // falls getLoggedName.php kein User zurückgibt, ist niemand angemeldet, somit keine Willkommensnachricht...
          }
        });
    });
});

// Admin-Content: sobald auf die Gruppenverwaltung geklickt wird aktuallisiert jQuery die Gruppenübersicht -> dynamisch
$('#btnGruppenVerwalten').click(function(){
  readGruppen();
});

// Admin-Content: Turnierverwaltung angeklickt -> Turnierübersicht & "aktives Turnier"-Meldung aktuallisieren
$('#btnturnierVerwalten').click(function(){
  showAktiveTurniere();
  readAktuelleTurniere();
});

// Admin-Content: Teamverwaltung bei aufruf aktuallisieren
$('#btnTeamsVerwalten').click(function(){
  readTeams();
});

// Admin-Content: dynamisches Turnier-Erstellen sobald der submit-Button erstellt wurde
$('#turnierErstellenCreateForm').submit(function(e){
  e.preventDefault(); // Default wäre Formular absenden und Seite neu laden -> das soll verhindert werden (um Dynamik bezubehalten)

  /* AJAX-Call: Die Seite insertTurnier.php wird mittels AJAX aufgerufen.
     Mitgegeben werden die Variablen: $_POST['name'], $_POST['jahr'], $_POST['typ'] */
  $.ajax({
    type: "POST", // Übertragungstyp setzen
    url: "./insert/insertTurnier.php", // Zielseite angeben
    data: {
            name: $('#turnierNameEingeben').val(), // Name des Turniers mitgeben
            jahr: $('#turnierJahrEingeben').val(), // Jahr in welchem das Turnier stattfindet
            typ: $('#turnierTypEingeben :selected').text()  // von Dropdown ausgewählten Typ in Text umwandeln und mitgeben
          },
    // bei erfolgreichem PHP-Aufruf (success) folgendes ausführen
    success: function(data)
    {
      console.log("insertTurnier ok"); // debugging ;)
      showAktiveTurniere(); // Turnierübersicht aktuallisieren
      readAktuelleTurniere(); // same here
    },
    // PHP-Aufruf fehlgeschlagen
    error: function(data){
      console.log("insertTurnier totally failed"); // debugging
    }
  });
});

// Admin-Content: dynamisches Gruppen-Erstellen. Wird beim Absenden des Formulares ausgeführt
$('#gruppeErstellenCreateForm').submit(function(e){
  e.preventDefault(); // Seite neuladen verhindern
  $.ajax({
    type: "GET", // Übertragungstyp auf GET setzen
    url: "./insert/insertGruppe.php", // Ziel-URL angeben
    data: "bezeichnung="+$('#gruppeBezeichnungEingeben').val().toUpperCase(), // GET-Variable $_GET['bezeichnung'] = Gruppenname von Formular in Grossbuchstaben, mittels id selektiert
    success: function() // wenn insertGruppe.php ohne Fehler aufgerufen, dann:
    {
      readGruppen(); // Gruppenübersich aktuallisieren
      $('#gruppeBezeichnungEingeben').val(null); // Eingabe aus dem Formular löschen (mit preventDefault wurde auch das verhindert...)
      refreshTeamErstellenDropdown();  // Team erstellen Dropdown aktuallisieren
      refreshSpielErstellenDropdown(); // same here
    }
  });
});

// Admin-Content: dynamisches Team-Erstellen
$('#teamErstellenForm').submit(function(e){
  e.preventDefault(); // Seite neuladen verhindern
  $.ajax({
    type: "GET", // Übertragungstyp auf GET setzen
    url:"./insert/insertTeam.php", // Ziel-URL setzen
    data: "land="+$('#teamErstellenLand').val()+"&gruppe="+$('#teamErstellenFormDropdown option:selected').val(), // $_GET['land'] = eingegebenes Land & $_GET['gruppe'] = ausgewählte Gruppe
    success: function(){ // wenn insertTeam.php ohne Fehler aufgerufen, dann:
      $('#teamErstellenLand').val(""); // Formular leeren
      readTeams(); // Team-Übersich aktuallisieren
      refreshSpielErstellenDropdown(); // Dropdown für Spiel-Erstellen aktuallisieren
    }
  });
});

// Admin-Content: dynamisches Spiel-Erstellen
$('#spielErstellenForm').submit(function(e){
  e.preventDefault(); // Seite neuladen verhindern
  var datum = $('#spielErstellenInputDatum').val(); // Datum aus Formular auslesen und in Variable datum speicher
  var sDate = datum.split('.'); // den Inhalt der Variable datum "splitten", Punkt als Trennzeichen (um später von DD.MM.YYYY in YYYY.MM.DD umzuwandeln)
  var spielnummer = 3;
  // Ist das Datum nicht genau 10 Zeichen lang oder wurde eine unzulässige Angabe bei Tag oder Monat gemacht, Admin-Alert einblenden
  if(datum.length != 10 || sDate[0] > 31 || sDate[1] > 12){
    $("#alertSpielErstellen").fadeIn("slow");
  }else{
    // wurden obige Bedingungen erfüllt, Admin-Alert ausblenden (falls er eingeblendet ist)
    $("#alertSpielErstellen").fadeOut(10);
    datum = sDate[2]+"-"+sDate[1]+"-"+sDate[0]; // Variable datum in MYSQL verlangtes DATE-Format bringen
    $.ajax({
      type: "GET",
      // GET-Variablen setzen
      data: "spielnr="+spielnummer+"&team1="+$('#spielErstellenFormDropdown1 option:selected').val()+"&datum="+datum+"&team2="+$('#spielErstellenFormDropdown2 option:selected').val(),
      url: "./insert/insertSpiel.php",
      success: function(data){
        $('#spielErstellenInputDatum').val(""); // Formular leeren
        $('#successSpielErstellen').fadeIn(800).fadeOut(2000); // Admin-Success: Meldung in 0.8sek einblenden, in 2sek ausblenden
      }
    });
  }
});

// sobald der DIV mit ID teamErstellen geladen ist -> Dropdown aktuallisieren
$('#teamErstellen').ready(function(){
  refreshTeamErstellenDropdown();
});

// soblad der DIV mit ID spielErstellen geladen ist -> Dropdown aktuallisieren
$('#spielErstellen').ready(function() {
  refreshSpielErstellenDropdown();
});

// Admin-Content: Dropdown von Team-Erstellen Formular dynamisch aktuallisieren
function refreshTeamErstellenDropdown(){
  var data = "";
  $.ajax({
    url:"./read/readGruppen.php",
    data: data,
    dataType: "JSON",
    success: function(data){
      var dropdown = "";
        $.each(data, function(id, obj){
          dropdown += "<option value="+obj.Gruppe_ID+">"+obj.Gruppenname+"</option>";
        });
      $("#teamErstellenFormDropdown").html(dropdown);
    }
  });
};

// Admin-Content: Dropdown von Spiel-Erstellen Formular dynamisch aktuallisieren
function refreshSpielErstellenDropdown() {
  var data = ""; // data-String vorbereiten
  $.ajax({
    url:"./read/readTeamsORDERBYTeams.php", // Ziel-URL
    data: data, // noch leerer String mitgeben
    dataType: "JSON", // die PHP-Seite gibt uns Daten im JSON Format zurück
    success: function(data){
      var dropdown = ""; // HTML-Dropdown vorbereiten
      // für jedes JSON Objekt im data-String einen neuen Eintrag in die dropdown-Variable schreiben
      $.each(data, function(id, obj){
        dropdown += "<option value="+obj.Team_ID+">"+obj.Land+"</option>";
      });
      $("#spielErstellenFormDropdown1").html(dropdown); // vorbereitetes Dropdown anfügen
      $("#spielErstellenFormDropdown2").html(dropdown); // same here
    }
  });
}

// User-Content: Meldung welches Turnier aktiv ist
function showAktiveTurniere(){
  $.ajax({
    url:"./read/readAktiveTurniere.php", // Ziel-URL
    data: "", // data-String vorbereiten
    dataType: 'json', // return-Type JSOn
    success: function(data){
      // wurde kein aktives Turnier gefunden, dann:
      if (data === null)
      {
        $('#turnierUebersicht').hide(); // Admin-Content: Turnierübersicht verstecken (die Seite würde eine leere Tabelle anzeigen)
        $('#aktivesTurnier').hide(); // User-Content: Meldung über aktives Tunrier verstecken
        $('#turnierErstellenCreate').show(); // Admin-Content: Turnier-Erstellen Formular anzeigen
      }else{
        // Turniername nicht leer?
        if(!data[1] == '')
        {
          $('#turnierUebersicht').show(); // Admin-Content: Turnierübersicht anzeigen
          $('#turnierErstellenCreate').hide(); // Admin-Content: Turnier-Erstellen Formular verstecken
          $('#aktivesTurnier').hide(); // User-Content: aktives Turnier Meldung verstecken
          $('#aktivesTurnier').html("<h4>Aktives Turnier:</h4><p>"+data[1]+"</p>"); // User-Content: "aktives Turnier" Meldung zum aktuellen Turniername vorbereiten
          $('#aktivesTurnier').fadeIn(800); // User-Content: "aktives Turnier" Meldung in 0.8sek einblenden
        }
      }
    },
    beforeSend:function(){
      $("#aktivesTurnier").html = (""); // vor dem eigentlichen AJAX-Call soll der ganze DIV mit ID aktivesTurnier durch "nichts" ersetzt werden um später mit neuen Daten zu befüllen
    }
  });
};

// Admin-Content: Gruppenübersicht dynamisch darstellen
function readGruppen(){
  var data = ""; // data-String vorbereiten
  $.ajax({
    url:"./read/readGruppen.php", // Ziel-URL
    data: data,
    dataType: "JSON", // AJAX sagen das Daten von im JSON Format mitgegeben werden
    success: function(data){
      var tabelle = ""; // Tabelle vorbereiten
      // für jedes JSON Objekt welches von der PHP-Seite kommt:
      $.each(data, function(id, object){
        // neuer Eintrag in der Gruppenübersicht mittels HTML und JSON Objekte (durch object.OBJEKT angesprochen werden) erstellen
        // WICHTIG: jedem Delete-Button wird dem onClick-Attribut die Funktion deletegruppe("Datenbank-ID der jeweiligen Gruppe") angefügt
        tabelle += "<tr>\
          <td>"+object.Gruppenname+"</td>\
          <td><button class='btn btn-danger btn-sm' id='"+object.Gruppe_ID+"' onclick='deleteGruppe("+object.Gruppe_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
        </tr>"
      });
      $("#aktuelleGruppen").html("<table class='table'><thead><tr><th>Gruppe</th><th>Löschen</th></thead><tbody>"+tabelle+"</tbody></table>"); // oben erstellte Tabelle im DIV mit ID aktuelleGruppen einfügen
    },
    beforeSend:function(){
      $("#aktuelleGruppen").html = (""); // vor dem AJAX-Call die Tabelle leeren (sie könnte evtl. veraltete Daten enthalten)
    }
  });
};

// Admin-Content: dynamisches Gruppen löschen (noch nicht Idiotensicher, ist ja auch ein Admin-Content)
function deleteGruppe(id){
  $.ajax({
    type: "GET", // Typ auf GET setzen
    url:"./delete/deleteGruppe.php", // Ziel-URL
    data:"id="+id, // $_GET['id'] = "ID welche der Funktion mitgegeben wurde" -> Gruppe_ID aus Datenbank
    success: function(){
      readGruppen(); // Gruppenübersicht aktuallisieren
      // verzögert (0.4sek): Team-Übersicht aktuallisieren, da das Eintragen in die DB kurz dauert
      setTimeout(function(){
        readTeams();
      }, 400);
      refreshTeamErstellenDropdown(); // Team-Erstellen Dropdown für Gruppenauswahl aktuallisieren
    }
  });
};

// Admin-Content: aktives Turnier in Tabellenform dynamisch anzeigen
function readAktuelleTurniere(){
    var data = ""; // data-String vorbereiten
    $.ajax({
      url:"./read/readAktuelleTurniere.php", // Ziel-URL
      data: data, // noch leerer data-String mitgeben
      dataType: "JSON", // AJAX sagen das Daten im JSON-Format gesendet & verarbeitet werden
      success: function(data){
        var tabelle = ""; // Variable für Tabelle vorbereiten
        // für jedes JSON Objekt dass von der PHP-Seite "zurückgegeben" wird (sollte nur 1 Objekt im gesamten String sein):
        $.each(data, function(id, obj){
          /* einen neuen Tabelleneintrag erstellen
             dem Delete-Button wird die Turnier_ID inkl. onClick-Parameter(disableTurnier[Turnier_ID]) mitgeben
             WICHTIG: das Turnier wird nicht gelöscht, bloss deaktiviert -> "unsichtbar" gemacht
             */
          tabelle += "<tr>\
            <td>"+obj.Turniername+"</td>\
            <td>"+obj.Jahr+"</td>\
            <td>"+obj.Typ+"</td>\
            <td><button class='btn btn-danger btn-sm' id='"+obj.Turnier_ID+"' onclick='disableTurnier("+obj.Turnier_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
            "
        });
        $("#aktuelleTurniere").html("<table class='table'><thead><tr><th>Name</th><th>Jahr</th><th>Typ</th><th></th></thead><tbody>"+tabelle+"</tbody></table>"); // oben erstellte Tabelle einfügen
      },
      beforeSend:function(){
        $('#aktuelleTurniere').html = (""); // vor dem AJAX-Call die Tabelle leeren
      }
    });
};

// Admin-Content: Turnier deaktivieren
function disableTurnier(id){
  $.ajax({
    type: "GET", // Typ GET
    url:"./disable/disableTurnier.php", // Ziel-URL
    data:"id="+id, // $_GET['id'] = Turnier_ID
    success: function(data){
      showAktiveTurniere(); // Turnierübersicht aktuallisieren
      readAktuelleTurniere(); // same here
    }
  });
}

// Admin-Content: Teamübersicht aktuallisieren
function readTeams(){
  var data = ""; // data-String vorbereiten
  $.ajax({
    url:"./read/readTeams.php", // Ziel-URL angeben
    data: data,
    dataType: "JSON", // AJAX sagen das Daten im JSON-Format gesendet & verarbeitet werden
    success: function(data){
      var tabelle = ""; // tabelle vorbereiten
      // für jedes JSON Objekt dass von der PHP-Seite kommt:
      $.each(data, function(id, obj){
        // Variable tabelle mit neuem Tabelleneintrag befüllen
        // dem Delete-Button wird die Team_ID inkl. onClick-Parameter(deleteTeam[Team_ID]) mitgeben
        tabelle += "<tr>\
          <td>"+obj.Land+"</td>\
          <td>"+obj.Gruppenname+"</td>\
          <td><button class='btn btn-danger btn-sm' id='"+obj.Team_ID+"' onclick='deleteTeam("+obj.Team_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
          "
      });
      $("#aktuelleTeams").html("<table class='table'><thead><tr><th>Land</th><th>Gruppe</th><th></th></thead><tbody>"+tabelle+"</tbody></table>"); // oben erstellte Tabelle einfügen
    }
  });
}

// Admin-Content: Team dynamisch löschen
function deleteTeam(id){
  $.ajax({
    type: "GET", // Typ GET setzen
    url:"./delete/deleteTeam.php", // Ziel-URL
    data:"id="+id, // Team_ID von DB mitgeben (hardcoded im button)
    success: function(){
      setTimeout(function(){
        readTeams();
      }, 400); // bei Erfolg: Teamübersicht verzögert aktuallisieren
    }
  });
}
