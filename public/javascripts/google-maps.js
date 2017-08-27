// Global vars
var geocoder;
var infoWindow;
var map;
var center;
var markers = [];
var defaultBounds;
var input;
var autocomplete;


// Instantiate the APIHandler
var myApiGoogle = new APIHandler();

// Start Google Maps Map, Geocoder and InfoWindow. Called as callback from script in main-layouts
function startMap() {
  // Info regarding map
  geocoder = new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow;
  center = getNavigatorPosition();
  var mapOptions = {
    zoom: 8,
    center: center
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Info regarding the Autocomplete
  input = document.getElementById("address");
  defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(center.lat - 0.1, center.lng - 0.1),
    new google.maps.LatLng(center.lat + 0.1, center.lng + 0.1)
  );
  var completeOptions = {
    bounds: defaultBounds
  };
  autocomplete = new google.maps.places.Autocomplete(input, completeOptions);

  // Location from the input form
  var location = {
    lat: parseFloat($("#latitude").val()),
    lng: parseFloat($("#longitude").val())
  };

  // Different properties depending on the nav section
  if (nav === "events") {
    addMarker(location, "red");
    myApiGoogle.getUserCoord(function (response) {
      addMarker(response, "green");
    });
    map.addListener("click", function (e) {
      geocodeLatLng(geocoder, map, e.latLng);
      deleteMarkers("red");
      addMarker(e.latLng, "red");
    });
  } else if (nav === "profile") {
    addMarker(location, "green");
    map.addListener("click", function (e) {
      geocodeLatLng(geocoder, map, e.latLng);
      deleteMarkers("green");
      addMarker(e.latLng, "green");
    });
  }
}

// Use the navigator to get the current position; if something fails, return Madrid
function getNavigatorPosition() {
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
function addMarker(location, color) {
  var marker = new google.maps.Marker({
    icon: "http://maps.google.com/mapfiles/ms/icons/" + color + "-dot.png",
    position: location,
    map: map
  });
  markers.push(marker);
  updateForm(location);
}

// Clear all markers with a given color from the map
function deleteMarkers(color) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].icon === "http://maps.google.com/mapfiles/ms/icons/" + color + "-dot.png") {
      markers[i].setMap(null);
      markers.splice(i, 1);
    }
  }
}

// Use direct Geocode to get the location (latitude and longitude) from an address
function geocodeAddress() {
  var address = document.getElementById("address").value;
  geocoder.geocode({
    "address": address
  }, function (results, status) {
    if (status == "OK") {
      // Different properties depending on the nav section
      if (nav === "events") {
        deleteMarkers("red");
        addMarker(results[0].geometry.location, "red");
      } else if (nav === "profile") {
        deleteMarkers("green");
        addMarker(results[0].geometry.location, "green");
      }
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