$().ready(function () {
  const icalText =
    "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ical.marudot.com//iCal Event Maker\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nDTSTAMP:20220208T161610Z\nDTSTART:20220103T120000\nRRULE:FREQ=WEEKLY;BYDAY=TU;UNTIL=20220129T030000Z\nDTEND:20220103T133000\nSUMMARY:test\nEND:VEVENT\nEND:VCALENDAR";
  var buf = new ArrayBuffer(icalText.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = icalText.length; i < strLen; i++) {
    bufView[i] = icalText.charCodeAt(i);
  }
  var blob = new Blob([buf], { type: "text/calendar" });
  var url = URL.createObjectURL(blob);
  $("#tableCustom")
    .children("p")
    .append("<a href='" + url + "'>Download</a>");

  function getTableXML() {
    tableId = document
      .querySelector("#container > aside > div.menu > ol > li.active > a")
      .href.split("/")
      .reverse()[0];
    console.log(tableId);
    let requestURL =
      "https://api.everytime.kr/find/timetable/table?id=" + tableId;
    let request = new XMLHttpRequest();
    request.open("GET", requestURL);
    request.withCredentials = true;
    let response, table;
    request.onload = () => {
      response = request.responseXML;
      table = response.querySelector("table");
    };
    request.send();
    return table;
  }
  function getSemesterInfo(year, semester) {
    const list = getSemesterListXML().querySelector("response").children;
    const ret = {};
    for (var i = 0; i < list.length; i++) {
      if (
        list[i].getAttribute("year") == year &&
        list[i].getAttribute("semester") == semester
      ) {
        ret.start_date = list[i].getAttribute("start_date");
        ret.end_date = list[i].getAttribute("end_date");
        break;
      }
    }
    return ret;
  }

  function getSemesterListXML() {
    let requestURL =
      "https://api.everytime.kr/find/timetable/subject/semester/list";
    let request = new XMLHttpRequest();
    request.open("GET", requestURL);
    request.withCredentials = true;
    let response;
    request.onload = () => {
      response = request.responseXML;
    };
    request.send();
    return response;
  }

  function createiCalURL(table) {
    const icalText = "BEGIN:VCALENDAR\nVERSION:2.0\n";

    var blob = new Blob([buf], { type: "text/calendar" });
    var url = URL.createObjectURL(blob);
    return url;
  }
  function stringToArrayBuffer(text) {
    var buf = new ArrayBuffer(text.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = text.length; i < strLen; i++) {
      bufView[i] = text.charCodeAt(i);
    }
    return buf;
  }
});
