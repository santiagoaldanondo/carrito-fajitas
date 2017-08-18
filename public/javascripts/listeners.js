window.onload = function () {

  // Change <a> logout to POST method
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

  // Select an item from the list
  $(".list-selectable").click(function (e) {
    // Remove list-selected class from all the list-selectable items
    $(".list-selectable").removeClass("list-selected");
    // Add item-selected class to current item
    $(e.target.closest(".list-selectable")).addClass("list-selected");
    // Remove the prevent-default class from the menu
    $(".prevent-default").removeClass("prevent-default");
  });

};