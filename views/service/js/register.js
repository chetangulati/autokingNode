$('#otpSend').click(function (e) {
  e.preventDefault();
  var mob = $("input[name=mno]").val();
  var email = $("input[name=email]").val();
  var adhaar = $("input[name=adhaar]").val();
  var filled = true;

  $('input[required]').each(function () {
    if ($.trim($(this).val()) == '') filled = false;
  });
  if (filled) {
    $.ajax({
      url: "/otp",
      method: "post",
      data: {
        'mob': mob,
        'email': email,
        'adhaar': adhaar
      },
      success: function (e) {
        $(".otpModalCont").addClass('active');
      },
      error: function (e) {
        window.alert(e.responseText);
        console.log(e.responseText);
      }
    });
  }
  else {
    window.alert('Please fill all the fields');
  }
});

$(".otpModalCont").click(function (e) {
  console.log(e);
  // $(".otpModalCont").removeClass('active');
});

var lat = 28.610851;
var lng = 77.236010;

$(".close").click(function () {
  $('.mapModal').removeClass('active');
  $('.mapFilter').removeClass('active');
});
$(".mapFilter").click(function () {
  $('.otpModalCont').removeClass('active');
  $('.mapModal').removeClass('active');
});

$('#loc').click(function () {
  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          lng = position.coords.longitude;
          lat = position.coords.latitude;
          $('.mapModal').addClass('active');
          $('.mapFilter').addClass('active');
          initMap();
        }, function (error) {
          if (error.code === error.PERMISSION_DENIED) {
            window.alert("Please allow the location access");
          }
        });
    }
    else {
      alert('Browser does not supports location');
    }
});

//Set up some of our variables.
var map; //Will contain map object.
var marker = false; ////Has the user plotted their location marker?

//Function called to initialize / create the map.
//This is called when the page has loaded.
function initMap() {

    //The center location of our map.
    var centerOfMap = new google.maps.LatLng(lat, lng);

    //Map options.
    var options = {
      center: centerOfMap, //Set center.
      zoom: 12 //The zoom value.
    };

    //Create the map object.
    map = new google.maps.Map(document.getElementById('map'), options);

    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function(event) {
        //Get the location that the user clicked.
        var clickedLocation = event.latLng;
        //If the marker hasn't been added.
        if(marker === false){
            //Create the marker.
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true //make it draggable
            });
            //Listen for drag events!
            google.maps.event.addListener(marker, 'dragend', function(event){
                markerLocation();
            });
        } else{
            //Marker has already been added, so just change its location.
            marker.setPosition(clickedLocation);
        }
        //Get the marker's location.
        markerLocation();
    });
}

//This function will get the marker's current location and then add the lat/long
//values to our textfields so that we can save the location.
function markerLocation(){
    //Get location.
    var currentLocation = marker.getPosition();
    //Add lat and lng values to a field that we can save.
    $('#lat').val(currentLocation.lat()); //latitude
    $('#lng').val(currentLocation.lng()); //longitude
    $('#loc span').html("Change location");
}

//allow only numbers
$(document).ready(function () {
  $("input[data-inp=number]").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
  });
