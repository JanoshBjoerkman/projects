/*
  Autor:              Janosh Björkman
  Letzte Änderung:    21.04.2016
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

// Admin-Content: Turnierverwaltung angeklickt -> Turnierübersicht & "aktives Turnier"-Meldung aktualliesieren
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
     Mitgegeben werden die Variabeln: $_POST['name'], $_POST['jahr'], $_POST['typ'] */
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
    success: function() // insertGruppe.php ohne Fehler aufgerufen
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
    type: "GET",
    url:"./insert/insertTeam.php",
    data: "land="+$('#teamErstellenLand').val()+"&gruppe="+$('#teamErstellenFormDropdown option:selected').val(),
    success: function(){
      $('#teamErstellenLand').val("");
      readTeams();
    }
  });
});

$('#spielErstellenForm').submit(function(e){
  e.preventDefault();
  var t1 = $('#spielErstellenFormDropdown1 option:selected').val();
  var t2 = $('#spielErstellenFormDropdown2 option:selected').val();
  var datum = $('#spielErstellenInputDatum').val();
  var sDate = datum.split('.');
  var spielnummer = 3;
  if(datum.length != 10 || sDate[0] > 31 || sDate[1] > 12){
    $("#alertSpielErstellen").fadeIn("slow");
  }else{
    $("#alertSpielErstellen").fadeOut(10);
    datum = sDate[2]+"-"+sDate[1]+"-"+sDate[0];
    console.log(datum);
    $.ajax({
      type: "GET",
      data: "spielnr="+spielnummer+"&team1="+t1+"&datum="+datum+"&team2="+t2,
      url: "./insert/insertSpiel.php",
      success: function(data){
        $('#spielErstellenInputDatum').val("");
        $('#successSpielErstellen').fadeIn(800).fadeOut(2000);
      }
    });
  }
});

$('#teamErstellen').ready(function(){
  refreshTeamErstellenDropdown();
});

$('#spielErstellen').ready(function() {
  refreshSpielErstellenDropdown();
});

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

function refreshSpielErstellenDropdown() {
  var data = "";
  $.ajax({
    url:"./read/readTeamsORDERBYTeams.php",
    data: data,
    dataType: "JSON",
    success: function(data){
      var dropdown = "";
      $.each(data, function(id, obj){
        dropdown += "<option value="+obj.Team_ID+">"+obj.Land+"</option>";
      });
      $("#spielErstellenFormDropdown1").html(dropdown);
      $("#spielErstellenFormDropdown2").html(dropdown);
    }
  });
}

function showAktiveTurniere(){
  $.ajax({
    url:"./read/readAktiveTurniere.php",
    data: "",
    dataType: 'json',
    success: function(data){
      if (data === null)
      {
        $('#turnierUebersicht').hide();
        $('#aktivesTurnier').hide();
        $('#turnierErstellenCreate').show();
      }else{
        var turnierID = data[0];
        var turnierName = data[1];
        var turnierJahr = data[2];
        var turnierStatus = data[3];
        var turnierTypID = data[4];
        if(!turnierName == '')
        {
          $('#turnierUebersicht').show();
          $('#turnierErstellenCreate').hide();
          $('#aktivesTurnier').hide();
          $('#aktivesTurnier').html("<h4>Aktives Turnier:</h4><p>"+turnierName+"</p>");
          $('#aktivesTurnier').fadeIn(800);
        }
      }
    },
    error:function(data){
      console.log('readAktiveTurniere does not work.');
    },
    beforeSend:function(){
      $("#aktivesTurnier").html = ("");
    }
  });
};

function readGruppen(){
  var data = "";
  $.ajax({
    url:"./read/readGruppen.php",
    data: data,
    dataType: "JSON",
    success: function(data){
      var tabelle = "";
      $.each(data, function(id, object){
        tabelle += "<tr>\
          <td>"+object.Gruppenname+"</td>\
          <td><button class='btn btn-danger btn-sm' id='"+object.Gruppe_ID+"' onclick='deleteGruppe("+object.Gruppe_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
        </tr>"
      });
      $("#aktuelleGruppen").html("<table class='table'><thead><tr><th>Gruppe</th><th>Löschen</th></thead><tbody>"+tabelle+"</tbody></table>");
    },
    beforeSend:function(){
      $("#aktuelleGruppen").html = ("");
    }
  });
};

function deleteGruppe(id){
  console.log(id);
  $.ajax({
    type: "GET",
    url:"./delete/deleteGruppe.php",
    data:"id="+id,
    success: function(){
      console.log('record deleted');
      readGruppen();
      setTimeout(function(){
        readTeams();
      }, 400);
      refreshTeamErstellenDropdown();
    }
  });
};

function readAktuelleTurniere(){
    var data = "";
    $.ajax({
      url:"./read/readAktuelleTurniere.php",
      data: data,
      dataType: "JSON",
      success: function(data){
        var tabelle = "";
        $.each(data, function(id, obj){
          tabelle += "<tr>\
            <td>"+obj.Turniername+"</td>\
            <td>"+obj.Jahr+"</td>\
            <td>"+obj.Typ+"</td>\
            <td><button class='btn btn-danger btn-sm' id='"+obj.Turnier_ID+"' onclick='disableTurnier("+obj.Turnier_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
            "
        });
        $("#aktuelleTurniere").html("<table class='table'><thead><tr><th>Name</th><th>Jahr</th><th>Typ</th><th></th></thead><tbody>"+tabelle+"</tbody></table>");
      },
      beforeSend:function(){
        $('#aktuelleTurniere').html = ("");
      }
    });
};

function disableTurnier(id){
  console.log(id);
  $.ajax({
    type: "GET",
    url:"./disable/disableTurnier.php",
    data:"id="+id,
    success: function(data){
      console.log("Turnier mit ID: "+data+" erfolgreich deaktiviert");
      showAktiveTurniere();
      readAktuelleTurniere();
    }
  });
}

function readTeams(){
  var data = "";
  $.ajax({
    url:"./read/readTeams.php",
    data: data,
    dataType: "JSON",
    success: function(data){
      var tabelle = "";
      $.each(data, function(id, obj){
        tabelle += "<tr>\
          <td>"+obj.Land+"</td>\
          <td>"+obj.Gruppenname+"</td>\
          <td><button class='btn btn-danger btn-sm' id='"+obj.Team_ID+"' onclick='deleteTeam("+obj.Team_ID+")'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button></td>\
          "
      });
      $("#aktuelleTeams").html("<table class='table'><thead><tr><th>Land</th><th>Gruppe</th><th></th></thead><tbody>"+tabelle+"</tbody></table>");
    }
  });
}

function deleteTeam(id){
  $.ajax({
    type: "GET",
    url:"./delete/deleteTeam.php",
    data:"id="+id,
    success: function(){
      console.log('laatz');
      readTeams();
    }
  });
}
