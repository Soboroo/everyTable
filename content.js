createForm("iCal", "tableCustom", "Export").appendTo("#container");
$("tableCustom").removeAttr("style");
// const ol = document.querySelector("#container > aside > div.title > ol");
// ol.appendChild(
//   createButton(
//     "iCal",
//     "tableExport",
//     "light image setting",
//     $("#tableCustom").show()
//   )
// );
createButton("iCal", "tableCustom", "light image setting").appendTo(
  "#container > aside > div.title > ol"
);

function createButton(text, liModal, aClass, handler) {
  // const newButton = document.createElement("li");
  // newButton.setAttribute("data-modal", liModal);
  // newButton.addEventListener("click", handler);
  const $newButton = $("<li>").attr("data-modal", liModal);
  $newButton.click(handler);

  // const a = document.createElement("a");
  // a.setAttribute("class", aClass);
  // a.innerText = text;
  const $a = $("<a>").addClass(aClass).text(text);

  // newButton.appendChild(a);
  // return newButton;
  $newButton.append($a);
  return $newButton;
}

function createForm(text, id, submitButtonText = null, handler = null) {
  // const form = document.createElement("form");
  // form.setAttribute("id", id);
  // form.setAttribute("class", "modal");
  const $form = $("<form>").attr("id", id).addClass("modal");

  // const header = document.createElement("h3");
  // header.innerText = text;
  const $header = $("<h3>").text(text);

  // const closeButton = document.createElement("a");
  // closeButton.setAttribute("class", "close");
  // closeButton.addEventListener("click", () => {
  //   $("#" + id).hide();
  // });
  const $closeButton = $("<a>").addClass("close");
  $closeButton.click(() => {
    $("#" + id).hide();
  });

  // form.appendChild(closeButton);
  // form.appendChild(header);
  $form.append($closeButton);
  $form.append($header);

  if (submitButtonText !== null) {
    // const submitButton = document.createElement("input");
    // submitButton.setAttribute("type", "submit");
    // submitButton.setAttribute("value", submitButtonText);
    // submitButton.addEventListener("click", handler);
    const $submitButton = $("<input>")
      .attr("type", "submit")
      .val(submitButtonText)
      .addClass("button");
    $submitButton.click(handler);

    // form.appendChild(submitButton);
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
