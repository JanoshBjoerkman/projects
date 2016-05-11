/*
  Autor:              Janosh Björkman
  Letzte Änderung:    09.05.2016
  Projekt:            Fussballwetten-Online

  Kleine Info:        jQuery ist der Grund, wieso diese Webseite nicht neu geladen wird, obwohl man Änderungen in der Datenbank
                      machen kann und diese auch automatisch aktuell gehalten werden. Alle Aufrufe von PHP-Seiten innerhalb dieses
                      Scripts geschehen ohne dass der User etwas mitbekommt, Stichwort "dynamisch". Kommentare meinerseits werden nur
                      fürs grobe Verständis & zur Übersicht gemacht. Für ausführliche Beschreibungen der vorkommenden Funktionen besuche
                      folgende Website: http://www.w3schools.com/jquery/
                      oder nutze Google :P
*/
var EDITRESULTSID = 0; //
//Initialisierung der Website, wird nur einmal ausgeführt (sobald die das komplette Dokument (Webseite) geladen ist)
$(document).ready(function(){
    $('#homeContent').ready(showAktiveTurniere);  // User-Content: Meldung ob ein Turnier aktiv ist
    $('#successSpielErstellen').hide(); // Admin-Alert verstecken
    $('#alertSpielErstellen').hide(); // Admin-Alert verstecken
    // User-Content: Willkommensnachricht
    $('#welcomeMessage').ready(function(){ // AJAX-Call um dynamisch herauszufinden ob ein User angemeldet ist
        $.ajax({
          url:"./getLoggedName.php",
          data: "",
          dataType: 'json',
          success: function(data){
            var userVorname = data;
            // wenn ein User angemeldet ist, Willkommensnachricht einblenden
            if(!userVorname == '')
            {
              $('#userContent').hide(function(){
                $('#welcomeMessage').hide();
                $('#welcomeMessage').html("<h2>Hallo "+userVorname+".</h2>");
                $('#welcomeMessage').fadeIn(1000).fadeOut(1000, function(){
                  $('#userContent').fadeIn(2000);
                });
              });
            } // falls getLoggedName.php kein User zurückgibt, ist niemand angemeldet, somit keine Willkommensnachricht...
          }
        });
    });
    // User-Content: Wette editieren
    $('#editWetteContent').ready(function(){
      $('#editWetteContent').html("<h1>YOLOMOLO</h1>");
    });
});

function editSpiel(id){
  $('#editSpielModal').modal('show');
  EDITRESULTSID = id;
}

$('#btnMeineWetten').click(function(){
  readWetten();
});

// Admin-Content: Turnierverwaltung angeklickt -> Turnierübersicht & "aktives Turnier"-Meldung aktuallisieren
$('#btnturnierVerwalten').click(function(){
  showAktiveTurniere();
  readAktuelleTurniere();
});

// Admin-Content: Teamverwaltung bei Aufruf aktuallisieren
$('#btnTeamsVerwalten').click(function(){
  readTeams();
});

// Admin-Content: Spielverwaltung bei Aufruf aktuallisieren
$('#btnSpieleVerwalten').click(function(){
  readGames();
});

// Vorrunden in Spielverwaltung verstecken
$('#toggleVorrunden').click(function(){
  $('#spielVorrundenUebersicht').toggle();
});

// Admin-Content: dynamisches Turnier-Erstellen sobald der submit-Button erstellt wurde
$('#turnierErstellenCreateForm').submit(function(e){
  e.preventDefault(); // Default-Verhalten eines Submit-Buttons wäre Formular absenden und Seite neu laden -> das soll verhindert werden (um Dynamik beizubehalten)
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
      setTimeout(function(){ // verzögert
        showAktiveTurniere(); // Turnierübersicht aktuallisieren
        readAktuelleTurniere(); // same here
        refreshSpielErstellenGruppeDropdown();
      }, 400);


    },
    // PHP-Aufruf fehlgeschlagen
    error: function(data){
      console.log("insertTurnier totally failed"); // debugging
    }
  });
});

// Admin-Content: dynamisches Team-Erstellen
$('#teamErstellenForm').submit(function(e){
  e.preventDefault(); // Seite neuladen verhindern
  $.ajax({
    type: "GET", // Übertragungstyp auf GET setzen
    url:"./insert/insertTeam.php", // Ziel-URL setzen
    data: "land="+$('#teamErstellenLand').val(), // $_GET['land'] = eingegebenes Land & $_GET['gruppe'] = ausgewählte Gruppe |+"&gruppe="+$('#teamErstellenFormDropdown option:selected').val()
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
  var spielnummer = $('#spielErstellenFormNr').val();
  // Ist das Datum nicht genau 10 Zeichen lang oder wurde eine unzulässige Angabe bei Tag oder Monat gemacht, Admin-Alert einblenden
  if(datum.length != 10 || sDate[0] > 31 || sDate[1] > 12){
    $("#alertSpielErstellen").fadeIn("slow");
  }else{
    // wurden obige Bedingungen erfüllt, Admin-Alert ausblenden (falls er eingeblendet ist)
    $("#alertSpielErstellen").fadeOut(10);
    datum = sDate[2]+"-"+sDate[1]+"-"+sDate[0]; // Variable datum in MYSQL verlangtes DATE-Format bringen
    $.ajax({
      type: "GET",
      data: "team1="+$('#spielErstellenFormDropdown1 option:selected').val()+"&datum="+datum+"&team2="+$('#spielErstellenFormDropdown2 option:selected').val()+"&gruppe="+$('#spielErstellenGruppeDropdown option:selected').val(),
      url: "./insert/insertSpiel.php",
      success: function(data){
        $('#spielErstellenInputDatum').val(""); // Formular leeren
        $('#successSpielErstellen').fadeIn(800).fadeOut(2000); // Admin-Success: Meldung in 0.8sek einblenden, in 2sek ausblenden
        readGames();
      }
    });
  }
});

$('#editResultForm').submit(function(e){
  e.preventDefault();
  $.ajax({
    type:"GET",
    data:"id="+EDITRESULTSID+"&pT1="+$('#editResultT1').val()+"&pT2="+$('#editResultT2').val(),
    url:"./insert/updateResult.php",
    success: function(){
      readGames();
    }
  });
  $('#editSpielModal').modal('hide');
});

// sobald der DIV mit ID teamErstellen geladen ist -> Dropdown aktuallisieren
$('#teamErstellen').ready(function(){
  refreshTeamErstellenDropdown();
});

// soblad der DIV mit ID spielErstellen geladen ist -> Dropdown aktuallisieren
$('#spielErstellen').ready(function() {
  refreshSpielErstellenDropdown();
  refreshSpielErstellenGruppeDropdown();
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
    url:"./read/readTeams.php", // Ziel-URL
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

function refreshSpielErstellenGruppeDropdown(){
  var data = ""; // data-String vorbereiten
  $.ajax({
    url:"./read/readGruppen.php", // Ziel-URL
    data: data, // noch leerer String mitgeben
    dataType: "JSON", // die PHP-Seite gibt uns Daten im JSON Format zurück
    success: function(data){
      var dropdown = ""; // HTML-Dropdown vorbereiten
      // für jedes JSON Objekt im data-String einen neuen Eintrag in die dropdown-Variable schreiben
      $.each(data, function(id, obj){
        dropdown += "<option value="+obj.Gruppe_ID+">"+obj.Gruppenname+"</option>";
      });
      $("#spielErstellenGruppeDropdown").html(dropdown); // vorbereitetes Dropdown anfügen
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

// Admin-Content: dynamisches Gruppen löschen (noch nicht Idiotensicher, ist ja auch ein Admin-Content)
function deleteGruppe(id){
  $.ajax({
    type: "GET", // Typ auf GET setzen
    url:"./delete/deleteGruppe.php", // Ziel-URL
    data:"id="+id, // $_GET['id'] = "ID welche der Funktion mitgegeben wurde" -> Gruppe_ID aus Datenbank
    success: function(){
      //readGruppen(); // Gruppenübersicht aktuallisieren
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
            </tr>"
        });
        $("#aktuelleTurniere").html("<table class='table'><thead><tr><th>Name</th><th>Jahr</th><th>Typ</th><th></th></tr></thead><tbody>"+tabelle+"</tbody></table>"); // oben erstellte Tabelle einfügen
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
          <td><button class='btn btn-danger btn-sm' id='"+obj.Team_ID+"' onclick='deleteTeam("+obj.Team_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
          </tr>"
      });
      $("#aktuelleTeams").html("<table class='table'><thead><tr><th>Land</th><th></th></tr></thead><tbody>"+tabelle+"</tbody></table>"); // oben erstellte Tabelle einfügen
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
        refreshSpielErstellenDropdown();
      }, 400); // bei Erfolg: Teamübersicht verzögert aktuallisieren
    }
  });
}

function deleteSpiel(id){
  $.ajax({
    type:"GET",
    url:"./delete/deleteSpiel.php",
    data:"id="+id,
    success: function(){
      setTimeout(function(){
        readGames();
      }, 600);
    }
  });
}

// Spielübersicht
function readGames(){
  $.ajax({
    url:"./read/readGames.php",
    data:"",
    dataType:"JSON",
    success: function(data){
      var anzahlReihen = data.length; // anzahl Reihen aus DB-Abfrage
      // HINT: anzalhReihen/2 = anzahl "realer" Spiele
      var tbl = ""; // Tabelle für Übersicht
      for(i = 0; i < anzahlReihen; i+=2){ // solange Index aktuelles Spiel kleiner als anzahl Reihen aus DB-Abfrage -> Zeile in Übersichtstabelle erstellen,
                                          //danach zum nächsten Spiel gehen (i+2: 2 aufeinanderfolgende Reihen gehören immer zum selben Spiel).
        // Team1 = aktuelles JSON-Objekt-Land, Team2 = nächstes JSON-Objekt-Land
        tbl += "<tr>\
          <td>"+serveDateFromDB(data[i].Datum)+"</td>\
          <td>"+data[i].Land+"</td>";
        if(data[i].Team1_goals == null){
          tbl += "<td>-</td>";
        }else{
          tbl += "<td>"+data[i].Team1_goals+":"+data[i].Team2_goals+"</td>";
        }
        tbl += "<td>"+data[i+1].Land+"</td>\
                <td><button class='btn btn-default btn-sm' id='edit:"+data[i].Spiel_ID+"' onclick='editSpiel("+data[i].Spiel_ID+")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>\
                <td><button class='btn btn-danger btn-sm' id='"+data[i].Spiel_ID+"' onclick='deleteSpiel("+data[i].Spiel_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
                </tr>";

        // In welche Übersichtstabelle soll die Zeile?
        switch(data[i].Gruppenname){
          case 'A':
              $("#vorrundenUebersichtGruppeA").html("<h4>A</h4><table class='table'><thead>\
                <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
                </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'B':
            $("#vorrundenUebersichtGruppeB").html("<h4>B</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'C':
            $("#vorrundenUebersichtGruppeC").html("<h4>C</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'D':
            $("#vorrundenUebersichtGruppeD").html("<h4>D</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'E':
            $("#vorrundenUebersichtGruppeE").html("<h4>E</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'F':
            $("#vorrundenUebersichtGruppeF").html("<h4>F</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'G':
            $("#vorrundenUebersichtGruppeG").html("<h4>G</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'H':
            $("#vorrundenUebersichtGruppeH").html("<h4>H</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'AF':
            $("#spielUebersichtGruppeAF").html("<h4>Achtel-Finale</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'VF':
            $("#spielUebersichtGruppeVF").html("<h4>Viertel-Finale</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'HF':
            $("#spielUebersichtGruppeHF").html("<h4>Halb-Finale</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
          case 'FINALE':
            $("#spielUebersichtGruppeFINALE").html("<h4>Finale</h4><table class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Resultat</th><th>Team2</th><th></th><th></th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
            break;
        }
        // ist das aktuelles Spiel nicht das letzte?
        if(i < anzahlReihen-2){
          // wenn das nächste Spiel nicht in der selben Gruppe ist, neue tbl leeren
          if(data[i+2].Gruppenname != data[i].Gruppenname){
            tbl = "";
          }
        }
      }
    }
  });
}

// gibt Datum welches von der DB kommt im Format DD.MM.YYYY zurück. Parameter d ist das zu formatierende Datum
function serveDateFromDB(d){
  ds = d.split('-'); // YYYY-MM-DD splitten
  return ds[2]+"."+ds[1]+"."+ds[0]; // YYYY-MM-DD to DD.MM.YYYY
}

function readWetten(){
  $.ajax({
    url:"./read/readWetten.php",
    data:"",
    dataType:"JSON",
    success: function(data){
      var tbl = "";
      var zaehler = 0;
      $.each(data, function(id, obj){
        if(obj.Wette_ID == null)
        {
          tbl = "<tr><td>bisher noch keine Wetten</td><td></td><td></td></tr>";
        }else{
          zaehler += 1;
          tbl += "<tr>\
            <td>Wettschein "+zaehler+"</td>\
            <td><button class='btn btn-default btn-sm' id='wette:"+obj.Wette_ID+"&user:"+obj.User_ID+"' onclick='editWetteOnClick("+obj.Wette_ID+")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>\
            <td><button class='btn btn-danger btn-sm' id='Wette_ID:"+obj.Wette_ID+"' onclick='deleteWette("+obj.Wette_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
            </tr>";
        }
      });
      $('#meineWettenUebersicht').html("<table class='table'><thead><tr><th>Übersicht</th><th></th><th></th></tr></thead><tbody>"+tbl+"</tbody></table>"); // oben erstellte Tabelle einfügen
    }
  });
}

function deleteWette(id){
  $.ajax({
    type:"GET",
    url:"./delete/deleteWette.php",
    data:"id="+id,
    success: function(data){
      setTimeout(function(){
        readWetten();
      }, 600);
    }
  });
}

function editWetteOnClick(id){
  window.location.href = "editWette.php?id="+id;
}
