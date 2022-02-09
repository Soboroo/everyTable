$().ready(function () {
  function getTableXML() {
    const tableId = document
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
        ret.start_date = list[i].getAttribute("start_date").split("-").join("");
        ret.end_date = list[i].getAttribute("end_date").split("-").join("");
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

  function createEvent(title, start, end, dayIndex, semesterInfo) {
    const day = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    var ret = "BEGIN:VEVENT\n";
    ret += "SUMMARY:" + title + "\n";
    ret += "DTSTART:" + semesterInfo.start_date + "T" + start + "00\n";
    ret += "DTEND:" + semesterInfo.start_date + "T" + end + "00\n";
    ret +=
      "RRULE:FREQ=WEEKLY;BYDAY=" +
      day[dayIndex] +
      ";UNTIL=" +
      semesterInfo.end_date +
      "T235959\n";
    ret += "UID:" + getUUID() + "\n";
    ret += "END:VEVENT\n";
    return ret;
  }
  function createiCalURL(table) {
    const icalText =
      "BEGIN:VCALENDAR\n" +
      "VERSION:2.0\n" +
      "PRODID:-//everyTable//everytime timetable maker//KO\n";

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

  function getUUID() {
    // UUID v4 generator in JavaScript (RFC4122 compliant)
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 3) | 8;
        return v.toString(16);
      }
    );
  }
  // 출처: https://goni9071.tistory.com/209 [고니의꿈]
});
