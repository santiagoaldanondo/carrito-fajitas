// Add selected class for the nav
function addSelectedNav() {
  $(".nav-button").removeClass("nav-selected");
  var nav = "." + window.location.pathname.split("/")[1];

  if (nav !== ".") {
    $(nav).addClass("nav-selected");
  }
}

addSelectedNav();

// Add selected class for the menu