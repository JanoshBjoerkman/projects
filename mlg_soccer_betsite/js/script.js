$('#btnGruppenVerwalten').click(readGruppen);

$('#turnierErstellenCreateForm').submit(function(e){
  e.preventDefault();
  var name = $('#turnierNameEingeben').val();
  var jahr = $('#turnierJahrEingeben').val();
  var typ = $('#turnierTypEingeben :selected').text();
  $.ajax({
    type: "POST",
    url: "./insertTurnier.php",
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
    url:"./readAktiveTurniere.php",
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
  console.log("funktion aufgerufen");
  $.ajax({
    url:"./read/readGruppen.php",
    dataType: 'json',
    success: function(json){
      console.log('success from readGruppen');
      console.log(json);
      var tabelle = "";
      $.each(JSON.parse(data), function(id, obj){
        // variable "tabelle" wird mit html tags und Daten aus der DB gefüllt
        tabelle += "<tr>\
        <td>"+obj.ID+"</td>\
        <td>"+obj.Gruppenname+"</td>\
        <td class='button'><button class='btn btn-danger' id='"+obj.ID+"' onclick='deleteEintrag("+obj.ID+")'>Delete</button></td>\
        </tr>"
      });
      // hier wird der String, der in der Variable "tabelle" steht in das HTML - Tag mit der id "ausgabe" eingefügt
      $("#aktuelleGruppen").html(tabelle);
    },
    beforeSend:function(){
      // macht, dass die Tabelle vor dem senden geleert wird
      $("#aktuelleGruppen").html = ("");
    }
  });
};
