function tags() {
  var a = $('#brand');
  var txt = a.val().replace(/[^a-z0-9\+\-\.\#\s]/ig,''); // allowed characters
  if(txt) $("<span class='tag'>"+ txt +"</span><input role='tag' class='taginp' type='hidden' value='"+ txt +"' ></input>").insertBefore($("#skillhidden"));
    a.val("");
}
function req() {
  var a = $('#req-input');
  var txt = a.val().replace(/[^a-z0-9\+\-\.\#\s]/ig,''); // allowed characters
  if(txt) $("<span class='tag'>"+ txt +"</span><input role='tag' class='reqinp' type='hidden' value='"+ txt +"' ></input>").insertBefore($("#reqhidden"));
    a.val("");
}

$("#brand").keyup(function (e) {
  if (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 9 && e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 20 && e.keyCode != 13) {
    var inp = $("#brand").val();
    var v = $("input[name=vehicleType]:checked").val();
    var re = /^[ A-Za-z0-9,._@#&]*$/;
    if (re.test(inp) && inp !== "") {
      $.ajax({
        type: 'get',
        url: '/brand',
        data: 'q='+inp+'&v='+v,
        dataType: 'json',
        success: function (data) {
          $("#brands ul").empty();
          $.each(data, function (i) {
            $("<li id='" +data[i]._id+ "'>" + data[i].brand + "</li>").appendTo($("#brands ul"));
          });
          $("#brands li").first().addClass("hlight")
          $("#brands ul li").click(function () {
            $("#brand").val($(this).html());
            $("#brands ul").empty();
          });
          $("#brand").focus();
        },
        error: function () {
          console.error("Error");
        }
      });
    }
    else{
      $("#brands ul").empty()
    }
  }
  });
  $(document).keyup(function(e) {
      var $hlight = $('#brands li.hlight'), $div = $('#brands li');
      if (e.keyCode == 40) {
          $hlight.removeClass('hlight').next().addClass('hlight');
          if ($hlight.next().length == 0) {
              $div.eq(0).addClass('hlight')
          }
      } else if (e.keyCode === 38) {
          $hlight.removeClass('hlight').prev().addClass('hlight');
          if ($hlight.prev().length == 0) {
              $div.eq(-1).addClass('hlight')
          }
      }
  });
  $(window).keydown(function (e) {
    if (e.keyCode == 13 && ($("#brands ul").html() != "")) {
        console.log($("#brands ul").html());
        $("#brand").val($('#brands li.hlight').html());
        $("#brands ul").empty();
    }
  });



  $("#model").keyup(function (e) {
    if (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 9 && e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 20 && e.keyCode != 13) {
      var inp = $("#model").val();
      var v = $("input[name=vehicleType]:checked").val();
      var brand = $("#brand").val();
      var re = /^[ A-Za-z0-9,._@#&]*$/;
      if (re.test(inp) && inp !== "") {
        $.ajax({
          type: 'get',
          url: '/model',
          data: 'q='+inp+'&b='+brand+'&v='+v,
          dataType: 'json',
          success: function (data) {
            $("#models ul").empty();
            $.each(data, function (i) {
              $("<li id='" +data[i]._id+ "'>" + data[i].name + "</li>").appendTo($("#models ul"));
            });
            $("#models li").first().addClass("hlight")
            $("#models ul li").click(function () {
              $("#model").val($(this).html());
              $("#models ul").empty();
            });
            $("#model").focus();
          },
          error: function () {
            console.error("Error");
          }
        });
      }
      else{
        $("#models ul").empty()
      }
    }
    });
    $(document).keyup(function(e) {
        var $hlight = $('#models li.hlight'), $div = $('#models li');
        if (e.keyCode == 40) {
            $hlight.removeClass('hlight').next().addClass('hlight');
            if ($hlight.next().length == 0) {
                $div.eq(0).addClass('hlight')
            }
        } else if (e.keyCode === 38) {
            $hlight.removeClass('hlight').prev().addClass('hlight');
            if ($hlight.prev().length == 0) {
                $div.eq(-1).addClass('hlight')
            }
        }
    });
    $(window).keydown(function (e) {
      if (e.keyCode == 13 && ($("#models ul").html() != "")) {
          console.log($("#models ul").html());
          $("#model").val($('#models li.hlight').html());
          $("#models ul").empty();
      }
    });

$("#btntwo").click(function () {
  $("#submit").removeAttr('disabled');
});

// var bigValueSlider = document.getElementById('time-slider'),
// startSpan = document.getElementById('start-time');
// endSpan = document.getElementById('end-time');
//
// noUiSlider.create(bigValueSlider, {
//   start: [5,6],
//   connect: true,
//   	step: 1,
//     margin: 1,
//   	format: wNumb({
//   		decimals: 0
//   	}),
//   	range: {
//   		min: 0,
//   		max: 12
//   	}
// });
//
//
//
// var range = [
//   '9:00 AM','10:00 AM','11:00 AM',
//   '12:00 PM','1:00 PM','2:00 PM','3:00 PM',
//   '4:00 PM','5:00 PM','6:00 PM','7:00 PM',
//   '8:00 PM','9:00 PM'
// ];
//
// bigValueSlider.noUiSlider.on('update', function ( values, handle ) {
//   if (handle) {
//     endSpan.innerHTML = range[values[handle]];
//   }
//   else {
//     startSpan.innerHTML = range[values[handle]];
//   }
// });


// location
$('.stepbtn').click(function () {
  var href = $(this).attr("data-href");
  var valid = true;
 if ($(this).is($("#btnone"))) {
    join(".taginp", "#skillhidden");
    join(".reqinp", "#reqhidden");
  }
  var req = $($(this).attr("data-step")).find(".req");
  for (var i = 0; i < req.length; i++) {
    if ($(req[i]).val().length == 0) {
      valid = false;
      break;
    }
  }
  if (valid) {
    $(".step").removeClass("active");
    $(href).addClass("active");
    window.location.hash = href;
  }
  else{
    alert("Please fill in all the feilds");
  }
});
$(".back").click(function() {
  window.history.back();
  var loc = window.location.hash;
  $(".step").removeClass("active");
  $(loc).addClass("active");
  if (loc == "") {
    $("#one").addClass("active");
  }
});



function perline() {
  var loc = window.location.hash;
  if (loc == "#two") {
    $("#percline").css("width","66.667%");
    $(".step").removeClass("active");
    $(loc).addClass("active");
  }
  else if (loc == "#three") {
    $("#percline").css("width","100%");
    $(".step").removeClass("active");
    $(loc).addClass("active");
  }
  // else if (loc == "#four") {
  //   $("#percline").css("width","66.668%");
  //   $(".step").removeClass("active");
  //   $(loc).addClass("active");
  // }
  // else if (loc == "#five"){
  //   $("#percline").css("width","83.335%");
  //   $(".step").removeClass("active");
  //   $(loc).addClass("active");
  // }
  // else if (loc == "#six"){
  //   $("#percline").css("width","100%");
  //   $(".step").removeClass("active");
  //   $(loc).addClass("active");
  // }
  else{
    $("#percline").css("width","33.334%");
    $(".step").removeClass("active");
    $("#one").addClass("active");
  }
  $(".step").removeClass("active");
  if (loc == "#" || loc == "") {
    $("#one").addClass("active")
  }
  else {
    $(loc).addClass("active");
  }
}
$(window).on('hashchange', function () {
  perline();
});

//join brands and requirements

function join(taginp, hiddeninp) {
  var arr = [];
  var a = $(taginp);

  for (var i = 0; i < a.length; i++) {
    arr[i] = $(a[i]).val();
  }
  $(hiddeninp).attr('value',arr.join(", "));
}

//allow onlu numbers
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

// //check last step and send the data
// $("#bookingForm").submit(function (e) {
//   if ($("input[name=mobile]").val().length == 0) {
//     e.preventDefault();
//     alert("Mobile Number is required");
//   }
//   else if ($("input[name=email]").val().length == 0) {
//     e.preventDefault();
//     alert("E-mail is required");
//   }
//   else if (!$("input[name=terms]").is(":checked")) {
//     e.preventDefault();
//     alert("Please accept terms and conditions");
//   }
// });



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
      zoom: 13 //The zoom value.
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
