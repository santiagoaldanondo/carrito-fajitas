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
      itemId: $(e.target.closest(".item-id")).attr("id")
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
      itemId: $(e.target.closest(".item-id")).attr("id")
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

// file input
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