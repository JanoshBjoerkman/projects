$(document).ready(function(){
    $('#homeContent').ready(showAktiveTurniere);
    $('#successSpielErstellen').hide();
    $('#alertSpielErstellen').hide();
    $('#welcomeMessage').ready(function(){
        $.ajax({
          url:"./getLoggedName.php",
          data: "",
          dataType: 'json',
          success: function(data){
            var userVorname = data;
            if(!userVorname == '')
            {
              $('#welcomeMessage').hide();
              $('#welcomeMessage').html("<h3>Hallo "+userVorname+".</h3>");
              $('#welcomeMessage').fadeIn(1000).fadeOut(1000);
            }
          }
        });
    });
});

$('#btnGruppenVerwalten').click(function(){
  readGruppen();
});

$('#btnturnierVerwalten').click(function(){
  showAktiveTurniere();
  readAktuelleTurniere();
});

$('#btnTeamsVerwalten').click(function(){
  readTeams();
});

$('#turnierErstellenCreateForm').submit(function(e){
  e.preventDefault();
  var name = $('#turnierNameEingeben').val();
  var jahr = $('#turnierJahrEingeben').val();
  var typ = $('#turnierTypEingeben :selected').text();
  $.ajax({
    type: "POST",
    url: "./insert/insertTurnier.php",
    data: {name:name,jahr:jahr,typ:typ},
    success: function(data)
    {
      console.log("insertTurnier ok");
      //$("#btnturnierVerwalten").click();
      showAktiveTurniere();
      readAktuelleTurniere();
    },
    error: function(data){
      console.log("insertTurnier totally failed");
    }
  });
});

$('#gruppeErstellenCreateForm').submit(function(e){
  e.preventDefault();
  var g_bez = $('#gruppeBezeichnungEingeben').val().toUpperCase();
  $.ajax({
    type: "GET",
    url: "./insert/insertGruppe.php",
    data: "bezeichnung="+g_bez,
    success: function()
    {
      readGruppen();
      $('#gruppeBezeichnungEingeben').val(null);
      refreshTeamErstellenDropdown();
      refreshSpielErstellenDropdown();
    }
  });
});

$('#teamErstellenForm').submit(function(e){
  e.preventDefault();
  var t_land = $('#teamErstellenLand').val();
  var t_gruppe = $('#teamErstellenFormDropdown option:selected').val();
  $.ajax({
    type: "GET",
    url:"./insert/insertTeam.php",
    data: "land="+t_land+"&gruppe="+t_gruppe,
    success: function(){
      var t_land = $('#teamErstellenLand').val("");
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
