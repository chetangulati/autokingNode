var bigValueSlider = document.getElementById('time-slider'),
startSpan = document.getElementById('start-time'),
endSpan = document.getElementById('end-time');

noUiSlider.create(bigValueSlider, {
  start: [5,6],
  connect: true,
  	step: 1,
    margin: 1,
  	format: wNumb({
  		decimals: 0
  	}),
  	range: {
  		min: 0,
  		max: 12
  	}
});



var range = [
  '9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM',
  '4:00 PM','5:00 PM','6:00 PM','7:00 PM',
  '8:00 PM','9:00 PM'
];

bigValueSlider.noUiSlider.on('update', function ( values, handle ) {
  if (handle) {
    endSpan.innerHTML = range[values[handle]];
  }
  else {
    startSpan.innerHTML = range[values[handle]];
  }
});

$("#menuBtn").click(function () {
  $("#mobileNav").addClass('active');
});
$("#close").click(function () {
  $("#mobileNav").removeClass('active');
});
$("#book").click(function (e) {
  e.preventDefault();
  $('.mapModal').addClass('active');
  $('.mapFilter').addClass('active');
  window.location.hash = "#four";
});
$(".close").click(function () {
  $('.mapModal').removeClass('active');
  $('.mapFilter').removeClass('active');
});
$(".mapFilter").click(function () {
  $('.mapFilter').removeClass('active');
  $('.mapModal').removeClass('active');
});

$(document).ready(function () {
  var loc = encodeURIComponent(window.location.href);
  $("#login").html('<a href="/login?next='+ loc +'">Login to use pre saved details</a>')
  var date = new Date();
  var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  var end = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  $("input[name=date]").datepicker({
    format: "mm/dd/yyyy",
    todayHighlight: true,
    startDate: today,
    endDate: end,
    autoclose: true
  });
  $("input[name=date]").datepicker('setDate', today);
});

$("#bookingForm").submit(function (e) {
  e.preventDefault();
  function getParameterByName(parameterName) {
      var result = null,
          tmp = [];
      var items = location.search.substr(1).split("&");
      for (var index = 0; index < items.length; index++) {
          tmp = items[index].split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      }
      return result;
  }
  function services() {
    var result = [],
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === "service") result.push(decodeURIComponent(tmp[1]));
    }
    return result;
  }
  var body = JSON.stringify({
      'serviceProvider': getParameterByName("sp"),
      'vehicleType': getParameterByName('vehicleType'),
      'vehicle': getParameterByName('brand') + "_" + getParameterByName('model'),
      'fuel': getParameterByName('fuel'),
      'lat': getParameterByName("lat"),
      'lng': getParameterByName('lng'),
      'services': services(),
      'pnd': $("input[name=pnd]:checked").val(),
      'pndAddress': $("textarea[name=pndAddress]").val(),
      'date': $("input[name=date]").val(),
      'slot': bigValueSlider.noUiSlider.get(),
      'mobile': $("input[name=mobile]").val(),
      'email': $("input[name=email]").val(),
      'otp': $("input[name=bookotp]").val(),
  });
  var bodytest = JSON.stringify({'hello': true});
  $.ajax({
    url: "/booking",
    type: "POST",
    contentType: "application/json",
    data: body,
    success: function (e) {
      alert("Your booking id is " + e + "You will be redirected to tracking page after this.");
      window.location = "/track?bookid="+e
    },
    error: function (e) {
      console.error(e);
    }
  });
});

$("#one").click(function () {
  if ($("input[name=pnd]:checked").val() == "true") {
    $("#pnda").html('<textarea name="pndAddress" class="req"/><label class="control-label">Pick and Drop Address</label><i class="bar"></i>');
  }
})

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
    if (this == $("#otpbtn")[0]) {
      $.ajax({
        url: "/bookingotp",
        method: "post",
        data: "mob=" + $("input[name=mobile]").val(),
        success: function (e) {
          alert("Please check your mobile for OTP");
          console.log(e);
        },
        error: function (e) {
          alert("Some error Occured");
          console.error(e.responseText);
        }
      });
    }
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

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  document.getElementById('lat').value = place.geometry.location.lat();
  document.getElementById('lng').value = place.geometry.location.lng();
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var geo = new google.maps.Geocoder;
      geo.geocode({'location': geolocation}, function (result, status) {
        if (status === 'OK') {
          document.getElementById('autocomplete').value = result[0].formatted_address;
        }
      });

    });
  }
}
