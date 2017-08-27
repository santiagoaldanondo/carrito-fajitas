window.fbAsyncInit = function () {
  FB.init({
    appId: "1370930256325061",
    autoLogAppEvents: true,
    xfbml: true,
    version: "v2.10"
  });
  FB.ui({
    method: "share",
    href: "https://developers.facebook.com/docs/"
  }, function (response) {});
  FB.AppEvents.logPageView();
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "facebook-jssdk"));