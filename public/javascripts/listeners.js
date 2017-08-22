var myApiListen = new APIHandler();

function listenLogout() { // Change <a> logout to POST method  
  if ($("#logout")) {
    $("#logout").on("click", function (e) {
      var myForm = document.createElement("form");
      myForm.action = this.href; // the href of the link
      myForm.method = "POST";
      document.body.appendChild(myForm); // needed to prevent error "form submission cancelled because the form is not connected"
      myForm.submit();
      e.preventDefault(); // cancel the link itself
    });
  }
}
listenLogout();

function listenSelectList() { // Allow selecting an item from the list
  $(".list-selectable").click(function (e) {
    $(".list-selectable").removeClass("list-selected"); // Remove list-selected from all
    $(".list-hidable").addClass("list-hidden");
    $(e.target.closest(".list-selectable")).addClass("list-selected"); // Add item-selected to current
    $(e.target.closest(".list-selectable")).find(".list-hidden:first").removeClass("list-hidden"); // Display info for current
  });
}
listenSelectList();

function listenFav() {
  $(".fav-glyphicon").on("click", function (e) {
    var data = {
      eventId: $(e.target.closest(".event-id")).attr("id")
    };
    myApiListen.toggleFav(data, function () {
      $(e.target).toggleClass("glyphicon-heart-empty glyphicon-heart");
    });
  });
}
listenFav();

function listenAssist() {
  $(".assist-glyphicon").on("click", function (e) {
    var data = {
      eventId: $(e.target.closest(".event-id")).attr("id")
    };
    myApiListen.toggleAssist(data, function () {
      $(e.target).toggleClass("glyphicon-shopping-cart glyphicon-cutlery");
    });
  });
}
listenAssist();

// Search form
$(".search-form").submit(function (e) {
  e.preventDefault(); // cancel the link itself
  myApiListen.searchBox(function (response) { // Query the API to search events
    $(".list-group").remove();
    $(".contents-section").append(response); // Add the response html to the view
    listenSelectList(); // Add a listener to select elements from the list
    listenFav(); // Add a listener to change the fav glyphicon
    listenAssist(); // Add a listener to change the assist glyphicon
  });
});