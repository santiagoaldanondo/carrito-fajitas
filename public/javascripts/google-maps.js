// Global vars
var geocoder;
var infoWindow;
var map;
var center;
var markers = [];

// Instantiate the APIHandler
var myApiGoogle = new APIHandler();

// Start Google Maps Map, Geocoder and InfoWindow. Called as callback from script in main-layouts
function startMap() {
  geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow;
  center = getUserPosition();
  var mapOptions = {
    zoom: 8,
    center: center
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  myApiGoogle.getCoord(function (response) {
    addMarker(response);
  });

  map.addListener("click", function (event) {
    deleteMarkers();
    geocodeLatLng(geocoder, map, event.latLng);
    addMarker(event.latLng);
  });
}

// Use the navigator to get the user position; if something fails, return Madrid
function getUserPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      return center;
    }, function () {});
  }
  return {
    lat: 40.415363,
    lng: -3.703790
  };
}

// Add a marker to the map
function addMarker(location) {
  map.setCenter(location);
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
  updateForm(location);
}

// Clear all markers from the map and empty the array that contains them
function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// Use direct Geocode to get the location (latitude and longitude) from an address
function geocodeAddress() {
  var address = document.getElementById("address").value;
  geocoder.geocode({
    "address": address
  }, function (results, status) {
    if (status == "OK") {
      addMarker(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

// Use reverse Geocode to get an address from a location (latitude and longitude)
function geocodeLatLng(geocoder, map, latlng) {
  geocoder.geocode({
    "location": latlng
  }, function (results, status) {
    if (status === "OK" && results[0]) {
      $("#address").val(results[0].formatted_address);
    } else {
      $("#address").val("");
    }
  });
}

// Update the latitude and longitude inputs in the form from the value of the marker
function updateForm(location) {
  $("#latitude").val(location.lat);
  $("#longitude").val(location.lng);
}

// Add an event listener to the encode button
$("#encode").on("click", function () {
  geocodeAddress();
});