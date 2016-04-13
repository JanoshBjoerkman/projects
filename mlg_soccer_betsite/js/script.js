$('#btnGruppenVerwalten').click(function(){
  readGruppen();
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
      $("#btnturnierErstellen").click();
      refreshAktiveTurniere();
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
    }
  });
});

$(document).ready(function(){

    $('#homeContent').ready(refreshAktiveTurniere);

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

function refreshAktiveTurniere(){
  $.ajax({
    url:"./read/readAktiveTurniere.php",
    data: "",
    dataType: 'json',
    success: function(data){
      var turnierID = data[0];
      var turnierName = data[1];
      var turnierJahr = data[2];
      var turnierStatus = data[3];
      var turnierTypID = data[4];
      if(!turnierName == '')
      {
        $('#aktivesTurnier').hide();
        $('#aktivesTurnier').html("<h4>Aktives Turnier:</h4><p>"+turnierName+"</p>");
        $('#aktivesTurnier').fadeIn(800);
      }
    },
    error:function(data){
      console.log('readAktiveTurniere does not work.');
    },
    beforeSend:function(){
      // macht, dass die Tabelle vor dem senden geleert wird
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
          <td class='button'><button class='btn btn-danger btn-sm' id='"+object.Gruppe_ID+"' onclick='deleteGruppe("+object.Gruppe_ID+")'>Delete</button></td>\
        </tr>"
      });
      $("#aktuelleGruppen").html("<table class='table'><thead><tr><th>Gruppe</th><th>Konfiguration</th></thead><tbody>"+tabelle+"</tbody></table>");
    },
    beforeSend:function(){
      // macht, dass die Tabelle vor dem senden geleert wird
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
        console.log(data);
      },
      beforeSend:function(){
        $('#aktuelleTurniere').html = ("");
      }
    });
};
