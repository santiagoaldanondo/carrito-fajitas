var myApi = new APIHandler();

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
    if (!$(e.target).hasClass("fav-events") && !$(e.target).hasClass("fav-recipes") &&
      !$(e.target).hasClass("assist-glyphicon") && !$(e.target).hasClass("add-glyphicon") &&
      !$(e.target).hasClass("show-glyphicon") && !$(e.target).hasClass("edit-glyphicon")) {
      $(".list-selectable").removeClass("list-selected"); // Remove list-selected from all
      $(".list-hidable").addClass("list-hidden");
      $(e.target.closest(".list-selectable")).addClass("list-selected"); // Add item-selected to current
      $(e.target.closest(".list-selectable")).find(".list-hidden:first").removeClass("list-hidden"); // Display info for current
    }
  });
}
listenSelectList();

function listenEventsFav() {
  $(".fav-events").on("click", function (e) {
    var data = {
      itemId: $(e.target.closest(".item-id")).attr("id")
    };
    myApi.toggleEventsFav(data, function () {
      $(e.target).toggleClass("glyphicon-heart-empty glyphicon-heart");
    });
  });
}
listenEventsFav();

function listenRecipesFav() {
  $(".fav-recipes").on("click", function (e) {
    var data = {
      itemId: $(e.target.closest(".item-id")).attr("id")
    };
    myApi.toggleRecipesFav(data, function () {
      $(e.target).toggleClass("glyphicon-heart-empty glyphicon-heart");
    });
  });
}
listenRecipesFav();

function listenAssist() {
  $(".assist-glyphicon").on("click", function (e) {
    var data = {
      itemId: $(e.target.closest(".item-id")).attr("id")
    };
    myApi.toggleAssist(data, function () {
      $(e.target).toggleClass("glyphicon-pushpin glyphicon-remove");
    });
  });
}
listenAssist();

// Add recipe to local storage
function listenAdd() {
  $(".add-glyphicon").on("click", function (e) {
    var itemId = $(e.target.closest(".item-id")).attr("id");
    saveToLocal(itemId);
    $(e.target).toggleClass("glyphicon-plus glyphicon-ok");
  });
}
listenAdd();

// Search form
$(".search-form").submit(function (e) {
  e.preventDefault(); // cancel the link itself
  myApi.searchBox(function (response) { // Query the API to search events
    $(".list-group").remove();
    $(".contents-section").append(response); // Add the response html to the view
    listenSelectList(); // Add a listener to select elements from the list
    listenEventsFav(); // Add a listener to change the fav events glyphicon
    listenRecipesFav(); // Add a listener to change the fav recipes glyphicon
    listenAssist(); // Add a listener to change the assist glyphicon
    listenAdd();
    setAdd(); // Set the glyphicon to current state
  });
});

// save recipes to local storage
function saveToLocal(id) {
  if (localStorage[id]) {
    localStorage.removeItem(id);
  } else {
    localStorage.setItem(id, id);
  }
}

// Set recipe add-glyphicon
function setAdd() {
  var items = $(".add-glyphicon");
  items.each(function (index, item) {
    var id = $(item).closest(".item-id").attr("id");
    if (localStorage[id]) {
      $(item).toggleClass("glyphicon-plus glyphicon-ok");
    }
  });
}
setAdd();

// Add recipes to list in events/new
function addRecipe() {
  var data = localStorage;
  myApi.addRecipeList(data, function (response) {
    $(".list-group").remove();
    $(".recipes-section").append(response); // Add the response html to the view
    listenSelectList(); // Add a listener to select elements from the list
    listenEventsFav(); // Add a listener to change the fav events glyphicon
    listenRecipesFav(); // Add a listener to change the fav recipes glyphicon
    listenAssist(); // Add a listener to change the assist glyphicon
    listenAdd();
    setAdd(); // Set the glyphicon to current state
  });
}

if (window.location.pathname === "/events/new") {
  addRecipe();
}

// Add an input to send localstorage info to backend
$(".btn-event").on("click", function (e) {
  $("form").append("<input type='text' name='localStorage' id='localStorage' value=" + JSON.stringify(localStorage) + ">");
});


// file input to Amazon S3: listener
(() => {
  if (document.getElementById("file-input")) {
    document.getElementById("file-input").onchange = () => {
      const files = document.getElementById("file-input").files;
      const file = files[0];
      if (file == null) {
        return alert("No file selected.");
      }
      getSignedRequest(file);
    };
  }
})();

// file input to Amazon S3: sign connection
function getSignedRequest(file) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/v1/sign-s3?file-name=" + encodeURIComponent(file.filename) + "&file-type=" + file.type);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      } else {
        alert("Could not get signed URL.");
      }
    }
  };
  xhr.send();
}

// file input to Amazon S3: upload file
function uploadFile(file, signedRequest, url) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", signedRequest);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        document.getElementById("preview").src = url;
        document.getElementById("avatar-url").value = url;
        document.getElementById("picturePath").value = url;
      } else {
        alert("Could not upload file.");
      }
    }
  };
  xhr.send(file);
}

// Add selected class for the nav
function addSelectedNav() {
  $(".nav-button").removeClass("nav-selected");
  var nav = window.location.pathname.split("/")[1].split("?")[0];

  if (nav !== "") {
    $(".nav-" + nav).addClass("nav-selected");
  }
}
addSelectedNav();

// Add selected class for the menu
function addSelectedMenu() {
  $(".menu-button").removeClass("menu-selected");
  var menu = "";
  if (window.location.pathname.split("/")[2]) {
    menu = window.location.pathname.split("/")[2].split("?")[0].length < 24 ?
      window.location.pathname.split("/")[2].split("?")[0] :
      window.location.pathname.split("/")[3].split("?")[0];
  } else {
    menu = "main";
  }

  if (menu !== "") {
    $(".menu-" + menu).addClass("menu-selected");
  }
}
addSelectedMenu();

// Get query params from the url
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Clear localstorage
function clearLocalStorage() {
  if (getUrlParameter("valid")) {
    localStorage.clear();
  }
}
clearLocalStorage();