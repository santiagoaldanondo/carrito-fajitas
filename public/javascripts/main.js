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
    $(".list-selectable").removeClass("list-selected"); // Remove list-selected from all
    $(".list-hidable").addClass("list-hidden");
    $(e.target.closest(".list-selectable")).addClass("list-selected"); // Add item-selected to current
    $(e.target.closest(".list-selectable")).find(".list-hidden:first").removeClass("list-hidden"); // Display info for current
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

// Add recipe to local storage
function listenAdd() {
  $(".add-glyphicon").on("click", function (e) {
    var itemId = $(e.target.closest(".item-id")).attr("id");
    saveToLocal(itemId);
    $(e.target).toggleClass("glyphicon-plus glyphicon-ok");
  });
}
listenAdd();

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


// file input to Amazon S3
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
  var nav = "." + window.location.pathname.split("/")[1];

  if (nav !== ".") {
    $(nav).addClass("nav-selected");
  }
}

addSelectedNav();

// Add selected class for the menu