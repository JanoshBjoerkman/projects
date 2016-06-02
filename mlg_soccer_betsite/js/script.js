/*
  Autor:              Janosh Björkman
  Letzte Änderung:    26.05.2016
  Projekt:            Fussballwetten-Online

  Kleine Info:        jQuery ist der Grund, wieso diese Webseite nicht neu geladen wird, obwohl man Änderungen in der Datenbank
                      machen kann und diese auch automatisch aktuell gehalten werden. Alle Aufrufe von PHP-Seiten innerhalb dieses
                      Scripts geschehen ohne dass der User etwas mitbekommt, Stichwort "dynamisch". Kommentare meinerseits werden nur
                      fürs grobe Verständis & zur Übersicht gemacht. Für ausführliche Beschreibungen der vorkommenden Funktionen besuche
                      folgende Website: http://www.w3schools.com/jquery/
                      oder nutze Google :P
*/

var EDITRESULTSID = 0; // Globale Variable: Spiel_ID des zu editierenden Resultats

//Initialisierung der Website, wird nur einmal ausgeführt (sobald die das komplette Dokument (Webseite) geladen ist)
$(document).ready(function(){
    $('#homeContent').ready(showAktiveTurniere);  // User-Content: Meldung ob ein Turnier aktiv ist
    $('#successSpielErstellen').hide(); // Admin-Alert verstecken
    $('#alertSpielErstellen').hide(); // Admin-Alert verstecken
    // User-Content: Willkommensnachricht
    $('#welcomeMessage').ready(function(){ // AJAX-Call um dynamisch herauszufinden ob ein User angemeldet ist
        $.ajax({url:"./getLoggedName.php",data:"",dataType: 'json'}).done(function(data){
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
        });
    });
});

// loadingModal für createWette.php
$body = $("body#createWette");
$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }
});

function editSpiel(id){
  $('#editSpielModal').modal('show');
  EDITRESULTSID = id;
}

$('#btnMeineWettenCreate').click(function(){
  redirectTo("createWette.php");
});

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
  $.ajax({type: "POST",url: "./insert/insertTurnier.php",
    data:{
            name: $('#turnierNameEingeben').val(), // Name des Turniers mitgeben
            jahr: $('#turnierJahrEingeben').val(), // Jahr in welchem das Turnier stattfindet
            typ: $('#turnierTypEingeben :selected').text()  // von Dropdown ausgewählten Typ in Text umwandeln und mitgeben
  }}).done(function(data){
    console.log("insertTurnier ok"); // debugging ;)
    setTimeout(function(){ // verzögert
      showAktiveTurniere(); // Turnierübersicht aktuallisieren
      readAktuelleTurniere(); // same here
      refreshSpielErstellenGruppeDropdown();
    }, 400);
  });
});

// Admin-Content: dynamisches Team-Erstellen
$('#teamErstellenForm').submit(function(e){
  e.preventDefault(); // Seite neuladen verhindern
  $.ajax({type: "GET",url:"./insert/insertTeam.php", data:"land="+$('#teamErstellenLand').val()}).done(function(){
    $('#teamErstellenLand').val(""); // Formular leeren
    readTeams(); // Team-Übersich aktuallisieren
    refreshSpielErstellenDropdown(); // Dropdown für Spiel-Erstellen aktuallisieren
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
    $.ajax({type: "GET",
      data: "team1="+$('#spielErstellenFormDropdown1 option:selected').val()+"&datum="+datum+"&team2="+$('#spielErstellenFormDropdown2 option:selected').val()+"&gruppe="+$('#spielErstellenGruppeDropdown option:selected').val(),
      url: "./insert/insertSpiel.php"}).done(function(data){
        $('#spielErstellenInputDatum').val(""); // Formular leeren
        $('#successSpielErstellen').fadeIn(800).fadeOut(2000); // Admin-Success: Meldung in 0.8sek einblenden, in 2sek ausblenden
        setTimeout(function(){
          readGames();
        }, 400);
      });
  }
});

$('#editResultForm').submit(function(e){
  e.preventDefault();
  $.ajax({type:"GET",data:"id="+EDITRESULTSID+"&pT1="+$('#editResultT1').val()+"&pT2="+$('#editResultT2').val(),url:"./insert/updateResult.php"}).done(function(){
    readGames();
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

$('#createWetteVorrunden').ready(function(){
  readVorrundenForCreateWette();
  readGamesForCreateWette();
});
// Admin-Content: Dropdown von Team-Erstellen Formular dynamisch aktuallisieren
function refreshTeamErstellenDropdown(){
  $.ajax({url:"./read/readGruppen.php",data:"",dataType: "JSON"}).done(function(data){
    var dropdown = "";
      $.each(data, function(id, obj){
        dropdown += "<option value="+obj.Gruppe_ID+">"+obj.Gruppenname+"</option>";
      });
    $("#teamErstellenFormDropdown").html(dropdown);
  });
};

// Admin-Content: Dropdown von Spiel-Erstellen Formular dynamisch aktuallisieren
function refreshSpielErstellenDropdown() {
  $.ajax({url:"./read/readTeams.php",data:"",dataType: "JSON"}).done(function(data){
    var dropdown = ""; // HTML-Dropdown vorbereiten
    // für jedes JSON Objekt im data-String einen neuen Eintrag in die dropdown-Variable schreiben
    $.each(data, function(id, obj){
      dropdown += "<option value="+obj.Team_ID+">"+obj.Land+"</option>";
    });
    $("#spielErstellenFormDropdown1").html(dropdown); // vorbereitetes Dropdown anfügen
    $("#spielErstellenFormDropdown2").html(dropdown); // same here
  });
}

function refreshSpielErstellenGruppeDropdown(){
  $.ajax({url:"./read/readGruppen.php",data:"",dataType: "JSON"}).done(function(data){
    var dropdown = ""; // HTML-Dropdown vorbereiten
    // für jedes JSON Objekt im data-String einen neuen Eintrag in die dropdown-Variable schreiben
    $.each(data, function(id, obj){
      dropdown += "<option value="+obj.Gruppe_ID+">"+obj.Gruppenname+"</option>";
    });
    $("#spielErstellenGruppeDropdown").html(dropdown); // vorbereitetes Dropdown anfügen
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
  $.ajax({type: "GET",url:"./delete/deleteGruppe.php",data:"id="+id}).done(function(){
    setTimeout(function(){
      readTeams();
    }, 400);
    refreshTeamErstellenDropdown(); // Team-Erstellen Dropdown für Gruppenauswahl aktuallisieren
  });
};

// Admin-Content: aktives Turnier in Tabellenform dynamisch anzeigen
function readAktuelleTurniere(){
    $.ajax({url:"./read/readAktuelleTurniere.php",data:"",dataType: "JSON",
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
  $.ajax({type: "GET",url:"./disable/disableTurnier.php",data:"id="+id}).done(function(data){
    showAktiveTurniere(); // Turnierübersicht aktuallisieren
    readAktuelleTurniere(); // same here
  });
}

// Admin-Content: Teamübersicht aktuallisieren
function readTeams(){
  $.ajax({url:"./read/readTeams.php",data:"",dataType: "json"}).done(function(data){
    var tabelle = ""; // tabelle vorbereiten
    $.each(data, function(id, obj){
      // Variable tabelle mit neuem Tabelleneintrag befüllen
      // dem Delete-Button wird die Team_ID inkl. onClick-Parameter(deleteTeam[Team_ID]) mitgeben
      tabelle += "<tr>\
        <td>"+obj.Land+"</td>\
        <td><button class='btn btn-danger btn-sm' id='"+obj.Team_ID+"' onclick='deleteTeam("+obj.Team_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
        </tr>"
    });
    $("#aktuelleTeams").html("<table class='table'><thead><tr><th>Land</th><th></th></tr></thead><tbody>"+tabelle+"</tbody></table>"); // oben erstellte Tabelle einfügen
  });
}

// Admin-Content: Team dynamisch löschen
function deleteTeam(id){
  $.ajax({type: "GET",url:"./delete/deleteTeam.php",data:"id="+id}).done(function(){
    setTimeout(function(){
      readTeams();
      refreshSpielErstellenDropdown();
    }, 400); // bei Erfolg: Teamübersicht verzögert aktuallisieren
  });
}

function deleteSpiel(id){
  $.ajax({type:"GET",url:"./delete/deleteSpiel.php",data:"id="+id}).done(function(){
    setTimeout(function(){
      readGames();
    }, 800);
  });
}

// Spielübersicht
function readGames(){
  $.ajax({url:"./read/readGames.php",data:"",dataType:"json"}).done(function(data){
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
  });
}

// gibt Datum welches von der DB kommt im Format DD.MM.YYYY zurück. Parameter d ist das zu formatierende Datum
function serveDateFromDB(d){
  ds = d.split('-'); // YYYY-MM-DD splitten
  return ds[2]+"."+ds[1]+"."+ds[0]; // YYYY-MM-DD to DD.MM.YYYY
}

function readWetten(){
  $.ajax({url:"./read/readWetten.php",data:"",dataType:"json"}).done(function(data){
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
          <td><button class='btn btn-default btn-sm' id='wette:"+obj.Wette_ID+"&user:"+obj.User_ID+"' onclick='editWetteOnClick("+obj.Wette_ID+")'><span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span></button></td>\
          <td><button class='btn btn-danger btn-sm' id='Wette_ID:"+obj.Wette_ID+"' onclick='deleteWette("+obj.Wette_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
          </tr>";
      }
    });
    $('#meineWettenUebersicht').html("<table class='table'><thead><tr><th>Übersicht</th><th></th><th></th></tr></thead><tbody>"+tbl+"</tbody></table>"); // oben erstellte Tabelle einfügen
  });
}

// User-Content: Wettschein löschen
function deleteWette(id){
  $.ajax({type:"GET",url:"./delete/deleteWette.php",data:"id="+id}).done(function(data){
    setTimeout(function(){
      readWetten();
    }, 600);
  });
}

function editWetteOnClick(id){
  redirectTo("editWette.php?id="+id);
}

// User-Content: Wettscheine für createWette.php
function readVorrundenForCreateWette(){
  $.ajax({url:"./read/readGames.php",data:"",dataType:"json"}).done(function(data){
    var anzahlReihen = data.length; // anzahl Reihen aus DB-Abfrage
    // HINT: anzalhReihen/2 = anzahl "realer" Spiele
    var tbl = ""; // Tabelle für Übersicht
    for(i = 0; i < anzahlReihen; i+=2){ // solange Index aktuelles Spiel kleiner als anzahl Reihen aus DB-Abfrage -> Zeile in Übersichtstabelle erstellen,
                                        //danach zum nächsten Spiel gehen (i+2: 2 aufeinanderfolgende Reihen gehören immer zum selben Spiel).
      // Team1 = aktuelles JSON-Objekt-Land, Team2 = nächstes JSON-Objekt-Land
      tbl += "<tr>\
        <td>"+serveDateFromDB(data[i].Datum)+"</td>\
        <td>"+data[i].Land+"</td>\
        <td>"+data[i+1].Land+"</td>\
        <td><input type='radio' name='"+data[i].Spiel_ID+"'></td>\
        <td><input type='radio' name='"+data[i].Spiel_ID+"'></td>\
        <td><input type='radio' name='"+data[i].Spiel_ID+"'></td>\
        </tr>";

      // In welche Übersichtstabelle soll die Zeile?
      switch(data[i].Gruppenname){
        case 'A':
            $("#createWetteVorrundeA").html("<h4 class='ueberschrift'>Gruppe A</h4><table id='tblCreateWette-"+data[i].Gruppenname+"' class='table'><thead>\
              <tr><th>Datum</th><th>Team1</th><th>Team2</th><th>1</th><th>X</th><th>2</th></tr>\
              </thead><tbody>"+tbl+"</tbody></table>");
          break;
        case 'B':
          $("#createWetteVorrundeB").html("<h4 class='ueberschrift'>Gruppe B</h4><table id='tblCreateWette-"+data[i].Gruppenname+"' class='table'><thead>\
            <tr><th>Datum</th><th>Team1</th><th>Team2</th><th>1</th><th>X</th><th>2</th></tr>\
            </thead><tbody>"+tbl+"</tbody></table>");
          break;
        case 'C':
          $("#createWetteVorrundeC").html("<h4 class='ueberschrift'>Gruppe C</h4><table id='tblCreateWette-"+data[i].Gruppenname+"' class='table'><thead>\
            <tr><th>Datum</th><th>Team1</th><th>Team2</th><th>1</th><th>X</th><th>2</th></tr>\
            </thead><tbody>"+tbl+"</tbody></table>");
          break;
        case 'D':
          $("#createWetteVorrundeD").html("<h4 class='ueberschrift'>Gruppe D</h4><table id='tblCreateWette-"+data[i].Gruppenname+"' class='table'><thead>\
            <tr><th>Datum</th><th>Team1</th><th>Team2</th><th>1</th><th>X</th><th>2</th></tr>\
            </thead><tbody>"+tbl+"</tbody></table>");
          break;
        case 'E':
          $("#createWetteVorrundeE").html("<h4 class='ueberschrift'>Gruppe E</h4><table id='tblCreateWette-"+data[i].Gruppenname+"' class='table'><thead>\
            <tr><th>Datum</th><th>Team1</th><th>Team2</th><th>1</th><th>X</th><th>2</th></tr>\
            </thead><tbody>"+tbl+"</tbody></table>");
          break;
        case 'F':
          $("#createWetteVorrundeF").html("<h4 class='ueberschrift'>Gruppe F</h4><table id='tblCreateWette-"+data[i].Gruppenname+"' class='table'><thead>\
            <tr><th>Datum</th><th>Team1</th><th>Team2</th><th>1</th><th>X</th><th>2</th></tr>\
            </thead><tbody>"+tbl+"</tbody></table>");
          break;
        case 'G':
          $("#createWetteVorrundeG").html("<h4 class='ueberschrift'>Gruppe G</h4><table id='tblCreateWette-"+data[i].Gruppenname+"' class='table'><thead>\
            <tr><th>Datum</th><th>Team1</th><th>Team2</th><th>1</th><th>X</th><th>2</th></tr>\
            </thead><tbody>"+tbl+"</tbody></table>");
          break;
        case 'H':
          $("#createWetteVorrundeH").html("<h4 class='ueberschrift'>Gruppe H</h4><table id='tblCreateWette-"+data[i].Gruppenname+"' class='table'><thead>\
            <tr><th>Datum</th><th>Team1</th><th>Team2</th><th>1</th><th>X</th><th>2</th></tr>\
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
  });
}

// User-Content: Wettschein erstellen
$('#btnCreateWetteErstellen').click(function(){
  getTurniertyp(); // Turniertyp herausfinden und in (leider) globale Variable schreiben
});

function checkWettscheinProcedure(t){
  // alle Tips ausgefüllt?
  if(checkWettscheinVorrunden("A")){
    if(checkWettscheinVorrunden("B")){
      if(checkWettscheinVorrunden("C")){
        if(checkWettscheinVorrunden("D")){
          if(checkWettscheinVorrunden("E")){
            if(checkWettscheinVorrunden("F")){
              if(t == 'WM'){ // bei WM Gruppe G & H überprüfen
                if(checkWettscheinVorrunden("G")){
                  if(checkWettscheinVorrunden("H")){
                    neuerWettschein(t); // neue Wette erstellen + alle Tips in DB schreiben
                  }else{
                    alert("Bitte füllen Sie alle Tips der Gruppe: H aus.");
                  }
                }else{
                  alert("Bitte füllen Sie alle Tips der Gruppe: G aus.");
                }
              }else{
                neuerWettschein(t); // neue Wette erstellen + alle Tips in DB schreiben
              }
            }else{
              alert("Bitte füllen Sie alle Tips der Gruppe: F aus.");
            }
          }else{
            alert("Bitte füllen Sie alle Tips der Gruppe: E aus.");
          }
        }else{
          alert("Bitte füllen Sie alle Tips der Gruppe: D aus.");
        }
      }else{
        alert("Bitte füllen Sie alle Tips der Gruppe: C aus.");
      }
    }else{
      alert("Bitte füllen Sie alle Tips der Gruppe: B aus.");
    }
  }else{
    alert("Bitte füllen Sie alle Tips der Gruppe: A aus.");
  }
}

// User-Content: Wettschein erstellen
function neuerWettschein(t){
  $.ajax({url:"./insert/insertWette.php",data:"",dataType:"json"}).done(function(data){
    var wID = data.currentWette_ID;
    // Tips eintragen
    $.when.apply(null, insertTip('A', wID)).done(function(){
      console.log("A fertig");
      $.when.apply(null, insertTip('B', wID)).done(function(){
        console.log("B fertig");
        $.when.apply(null, insertTip('C', wID)).done(function(){
          console.log("C fertig");
          $.when.apply(null, insertTip('D', wID)).done(function(){
            console.log("D fertig");
            $.when.apply(null, insertTip('E', wID)).done(function(){
              console.log("E fertig");
              $.when.apply(null, insertTip('F', wID)).done(function(){
                console.log("F fertig");
                $.when.apply(null, insertTipFS('AF', wID)).done(function(){
                  console.log("AF fertig");
                  $.when.apply(null, insertTipFS('VF', wID)).done(function(){
                    console.log("VF fertig");
                    $.when.apply(null, insertTipFS('HF', wID)).done(function(){
                      console.log("HF fertig");
                      $.when.apply(null, insertTipFS('FINALE', wID)).done(function(){
                        console.log("Finale fertig");
                        $.when.apply(null, insertTipFS('WELTMEISTER', wID)).done(function(){
                          console.log("WELTMEISTER fertig");
                          if(t == 'WM'){
                            console.log('wm -> insert g und h');
                            $.when.apply(null, insertTip('G', wID)).done(function(){
                              $.when.apply(null, insertTip('H', wID)).done(function(){
                                redirectTo('index.php');
                              });
                            });
                          }else{
                            console.log('em -> redirect');
                            redirectTo('index.php');
                          }
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    // $.when(insertTip('A', wID), insertTip('B', wID), insertTip('C', wID), insertTip('D', wID), insertTip('E', wID), insertTip('F', wID),
    // insertTipFS('AF', wID), insertTipFS('VF', wID), insertTipFS('HF', wID), insertTipFS('FINALE', wID), insertTipFS('WELTMEISTER', wID)).done(function(){
    //   if(t == 'WM'){
    //     $.when(insertTip('G', wID), insertTip('H', wID)).done(function(iG, iH){
    //       //redirectTo("index.php");
    //     });
    //   }else{
    //     //redirectTo("index.php");
    //   }
    // });
  });
}

// User-Content: Tips einer gruppe eintragen
function insertTip(g, wID){
  var deferreds = [];
  $.each(getSpiele(g), function(id, obj){
    deferreds.push($.ajax({type:"GET", data:"sid="+obj.Spiel_ID+"&Toto="+obj.Toto+"&wid="+wID, url:"./insert/insertTip.php"}));
  });
  return deferreds;
}

function insertTipFS(g, wID){
  var deferreds = [];
  deferreds.push($.ajax({url:"./read/readGruppen.php",data:"",dataType:"json"}).done(function(data){
    var gID = 0;
    $.each(data, function(id, obj){
      if(g == obj.Gruppenname){
        gID = obj.Gruppe_ID;
      }
    });
    if(gID != 0){
      var s = getFSSpiele(g);
      for(i = 0; i < s.length; i += 2){
        if(g == 'WELTMEISTER'){
          $.ajax({type:"GET",data:"t1="+s[i].team_ID+"&t2="+s[i].team_ID+"&gID="+gID+"&sNr="+s[i].spielNr+"&w="+wID,url:"./insert/insertTipFS.php"});
        }else{
          $.ajax({type:"GET",data:"t1="+s[i].team_ID+"&t2="+s[i+1].team_ID+"&gID="+gID+"&sNr="+s[i].spielNr+"&w="+wID,url:"./insert/insertTipFS.php"});
        }
        // switch (g) {
        //   case 'AF':
        //   case 'VF':
        //   case 'HF':
        //   case 'FINALE':
        //     $.ajax({type:"GET",data:"t1="+s[i].team_ID+"&t2="+s[i+1].team_ID+"&gID="+gID+"&sNr="+s[i].spielNr+"&w="+wID,url:"./insert/insertTipFS.php"});
        //       break;
        //   case 'WELTMEISTER':
        //     $.ajax({type:"GET",data:"t1="+s[i].team_ID+"&t2="+s[i].team_ID+"&gID="+gID+"&sNr="+s[i].spielNr+"&w="+wID,url:"./insert/insertTipFS.php"});
        //       break;
        // }
      }
    }else{
      alert("Es tut uns leid, irgendetwas ist schief gelaufen.\nBitte wenden Sie sich an den Administrator.\nFehlercode: 2_CW_ITFS_CNFEG");
    }
  }));
  return deferreds;
}

// Teams aus Dropdowns auslesen (Finalspiele, die nach den Vorrunden)
function getFSSpiele(g){
  var json = [];
  var i = 1; // Zahl gerade: Team1, Zahl ungerade: Team2
  var sn = 0; // Spielnummer in Gruppe
  $('#tblCreateWette-'+g+' option:selected').each(function(){
    var item = {};
    item['team_ID'] = $(this).val(); // Team_ID von aktuellem Dropdown
    var splitted = $(this).parent().attr('id').split('-');
    item['spielNr'] = splitted[2];
    item['team'] = splitted[3];
    json.push(item);
  });
  return json;
}

// User-Content: gibt Tips von User für mitgegebene Tabelle als Objekt zurück
function getSpiele(g){
  var json = [];
  $('#tblCreateWette-'+g+' input[type="radio"]:checked').each(function(){
    var spielID = $(this).attr("name");
    var i = $(this).parent().index();
    var item = {};
    item["Spiel_ID"] = spielID;
    if(i == 3){
      item["Toto"] = 1;
    }
    if(i == 4){
      item["Toto"] = "X";
    }
    if(i == 5){
      item["Toto"] = 2;
    }
    json.push(item)
  });
  return json;
}

// User-Content: Sind 6 radiobuttons angekreuzt?
function checkWettscheinVorrunden(g){
  var anzahl = 0;
  $('#tblCreateWette-'+g+' input[type="radio"]:checked').each(function(){
    anzahl += 1;
  });
  if(anzahl != 6){
    return false;
  }else{
    return true;
  }
}

// User-Content: EM oder WM?
function getTurniertyp(){
    var TURNIERTYP = "";
    $.ajax({url:"./read/readAktuelleTurniere.php",data:"",dataType: "JSON"}).done(function(data){
      TURNIERTYP = data[0].Typ;
      checkWettscheinProcedure(TURNIERTYP);
    });
};

function readGamesForCreateWette(){
  $.ajax({url:"./read/readTeams.php",data:"",dataType: "JSON"}).done(function(data){
    var dropdown = "";
    $.each(data, function(id, obj){
      dropdown += "<option value="+obj.Team_ID+">"+obj.Land+"</option>";
    });
    $("[id^=createWetteSpielGruppe]").html(dropdown);
  });
}

function redirectTo(url){
  window.location.replace(url);
}
