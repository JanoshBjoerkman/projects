
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
    },
    error: function(data){
      console.log("insertTurnier totally failed");
    }
  });
});


$(document).ready(function(){

  $('#homeContent').ready(function(){
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
          $('#aktivesTurnier').html("<h4>Die "+turnierName+" beginnt bald, beginne jetzt zu Wetten!</h4>");
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
  });


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
