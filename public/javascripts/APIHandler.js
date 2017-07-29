class APIHandler {
  constructor(baseUrl) {
    this.BASE_URL = baseUrl;
  }

  callToAPI(url, method, callback, error, data) {
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
    let url = "/api/v1/getUserCoord";
    this.callToAPI(url, "GET", callback);
  }
}