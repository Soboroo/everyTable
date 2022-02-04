createForm("iCal", "tableCustom", "Export").appendTo("#container");
$("tableCustom").removeAttr("style");

createButton("iCal", "tableCustom", "light image setting").appendTo(
  "#container > aside > div.title > ol"
);
$('[data-modal="tableCustom"]').on("click", () => {
  $("#tableCustom").show();
});
$("a.close", "#tableCustom").on("click", function () {
  $("#tableCustom").hide();
});

function createButton(text, liModal, aClass, handler) {
  const $newButton = $("<li>").attr("data-modal", liModal);
  $newButton.click(handler);

  const $a = $("<a>").addClass(aClass).text(text);

  $newButton.append($a);
  return $newButton;
}

function createForm(text, id, submitButtonText = null, handler = null) {
  const $form = $("<form>").attr("id", id).addClass("modal");
  const $header = $("<h3>").text(text);

  const $closeButton = $("<a>").addClass("close");
  $closeButton.click(() => {
    $("#" + id).hide();
  });

  $form.append($closeButton);
  $form.append($header);

  if (submitButtonText !== null) {
    const $submitButton = $("<input>")
      .attr("type", "submit")
      .val(submitButtonText)
      .addClass("button");
    $submitButton.click(handler);
    $form.append($submitButton);
  }

  return $form;
}

function test() {
  // get id of selected table
  tableId = document
    .querySelector("#container > aside > div.menu > ol > li.active > a")
    .href.split("/")
    .reverse()[0];
  console.log(tableId);
  let requestURL =
    "https://api.everytime.kr/find/timetable/table?id=" + tableId;
  let request = new XMLHttpRequest();
  request.open("GET", requestURL);
  request.responseType = "text";
  request.withCredentials = true;
  request.onload = () => {
    let response = request.response;
    console.log(response);
  };
  request.send();
}
