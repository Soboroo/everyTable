const ol = document.querySelector("#container > aside > div.title > ol");

const newButton = document.createElement("li");
newButton.setAttribute("data-modal", "tableExport");
newButton.addEventListener("click", () => {
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
});

const a = document.createElement("a");
a.setAttribute("class", "light image setting");
a.innerText = "iCal";

newButton.appendChild(a);
ol.appendChild(newButton);
