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

function allowSelectList() {
  // Select an item from the list
  $(".list-selectable").click(function (e) {
    $(".list-selectable").removeClass("list-selected"); // Remove list-selected from all
    $(".list-hidable").addClass("list-hidden");
    $(e.target.closest(".list-selectable")).addClass("list-selected"); // Add item-selected to current
    $(e.target.closest(".list-selectable")).find(".list-hidden:first").removeClass("list-hidden"); // Display info for current
  });
}
allowSelectList();