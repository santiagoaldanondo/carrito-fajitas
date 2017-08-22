class APIHandler {
  constructor() {
    this.BASE_URL = window.location.origin;
  }

  callToAPI(url, method, callback, data, error) {
    url = `${this.BASE_URL}${url}`;
    $.ajax({
      method: method,
      url: url,
      data: data,
      success: callback,
      error: error,
      datatype: "json"
    });
  }

  getCoord(callback) {
    var url = "/api/v1/getUserCoord";
    this.callToAPI(url, "GET", callback);
  }

  // Used to get the info from a form and send it with ajax
  getInfoFromForm(form) {
    var returnObject = {};
    form.serializeArray().forEach(function (input) {
      returnObject[input.name] = input.value;
    });
    return returnObject;
  }

  searchBox(callback) {
    var path = window.location.pathname.split("/")[1];
    var url = "/api/v1/" + path + "/search";
    var data = this.getInfoFromForm($(".search-form"));
    this.callToAPI(url, "POST", callback, data);
  }

  toggleFav(data, callback) {
    var url = "/api/v1/" + window.location.pathname.split("/")[1] + "/toggleFav";
    this.callToAPI(url, "POST", callback, data);
  }

  toggleAssist(data, callback) {
    var url = "/api/v1/" + window.location.pathname.split("/")[1] + "/toggleAssist";
    this.callToAPI(url, "POST", callback, data);
  }

}