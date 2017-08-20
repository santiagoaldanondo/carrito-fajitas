// Instantiate the APIHandler
var myApiSearch = new APIHandler("http://localhost:3000");

// Search form
$(".search-form").submit(function (e) {
  e.preventDefault(); // cancel the link itself
  myApiSearch.searchEvent(function (response) { // Query the API to search events
    $(".list-group").remove();
    $(".contents-section").append(response); // Add the response html to the view
    listenSelectList(); // Add a listener to select elements from the list
  });
});