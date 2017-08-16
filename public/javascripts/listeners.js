window.onload = function () {
  if (document.getElementById("logout")) {
    document.getElementById("logout").onclick = function () {
      var myForm = document.createElement("form");
      myForm.action = this.href; // the href of the link
      myForm.method = "POST";
      document.body.appendChild(myForm); // needed to prevent error "form submission cancelled because the form is not connected"
      myForm.submit();
      return false; // cancel the actual link
    };
  }
};