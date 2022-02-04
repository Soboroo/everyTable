const ol = document.querySelector("#container > aside > div.title > ol");
ol.appendChild(
  createButton("iCal", "tableExport", "light image setting", () => {
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
  })
);

function createButton(text, liModal, aClass, handler) {
  const newButton = document.createElement("li");
  newButton.setAttribute("data-modal", liModal);
  newButton.addEventListener("click", handler);

  const a = document.createElement("a");
  a.setAttribute("class", aClass);
  a.innerText = text;

  newButton.appendChild(a);
  return newButton;
}
