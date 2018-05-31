function sideNav() {
  $("#sideNav").toggleClass('open');
  $("#filterSideNav").toggleClass('open');
}

$('.menuBtn').click(function () {
  sideNav();
});

$('#filterSideNav').click(function (e) {
  sideNav();
});
$('#modalBtntwo').click(function () {
  $("#two").addClass('active');
});
$('#modalBtnfour').click(function () {
  $("#four").addClass('active');
});

$(".close").click(function () {
  $(".bookingModal").removeClass('active');
})
$('#modalBtnfour').click(function () {
  $(".bookingModal").addClass('active');
});
//
// $(".drop").bind('click mouseover', function () {
//   var a = this.getAttribute('data-drop');
//   $(a).addClass('open');
// });

  window.onload = function () {
    geolocate();
  };
  // This example displays an address form, using the autocomplete feature
  // of the Google Places API to help users fill in the information.

  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

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
