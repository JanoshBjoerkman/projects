$(document).ready(function(){

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
          $('#aktivesTurnier').html("<h1>"+turnierName+"</h1>");
        }
      },
      error:function(data){
        alert('readAktiveTurniere does not work.');
      },
      beforeSend:function(){
        // macht, dass die Tabelle vor dem senden geleert wird
        $("#aktivesTurnier").html = ("");
      }
    });


    $('#userContent').ready(function(){
        $.ajax({
          url:"./getLoggedName.php",
          data: "",
          dataType: 'json',
          success: function(data){
            var userVorname = data;
            if(!userVorname == '')
            {
              $('#userContent').html("<h3>Hallo "+userVorname+"</h3>");
            }
          }
        });
    });

});
