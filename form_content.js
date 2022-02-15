$().ready(function () {
  const button = $("<a>Download</a>");
  button.click(async function () {
    await getTableXML().then(async function (table) {
      await createiCalURL(table).then(function (url) {
        console.log(url);
      });
    });
  });
  $("#tableCustom").children("p").append(button);

  function getTableXML() {
    const tableId = document
      .querySelector("#container > aside > div.menu > ol > li.active > a")
      .href.split("/")
      .reverse()[0];
    console.log(tableId);
    let requestURL =
      "https://api.everytime.kr/find/timetable/table?id=" + tableId;

    return new Promise(function (resolve, reject) {
      fetch(requestURL, { credentials: "include" })
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
          resolve(
            new DOMParser()
              .parseFromString(text, "text/xml")
              .querySelector("table")
          );
        });
    });
  }

  function getSemesterListXML() {
    let requestURL =
      "https://api.everytime.kr/find/timetable/subject/semester/list";
    return new Promise(function (resolve, reject) {
      fetch(requestURL, { credentials: "include" })
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
          resolve(new DOMParser().parseFromString(text, "text/xml"));
        });
    });
  }

  async function getSemesterInfo(year, semester) {
    var list = await getSemesterListXML();
    list = list.querySelector("response").children;
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

  function createEvent(
    title,
    start,
    end,
    dayIndex,
    semesterInfo,
    location = null,
    description = null
  ) {
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
    if (location !== null) {
      ret += "LOCATION:" + location + "\n";
    }
    if (description !== null) {
      ret += "DESCRIPTION:" + description + "\n";
    }
    ret += "END:VEVENT\n";
    return ret;
  }
  async function createiCalURL(table) {
    var icalText =
      "BEGIN:VCALENDAR\n" +
      "VERSION:2.0\n" +
      "PRODID:-//everyTable//everytime timetable maker//KO\n";
    const year = table.getAttribute("year");
    const semester = table.getAttribute("semester");
    var semesterInfo;
    await getSemesterInfo(year, semester).then(function (data) {
      semesterInfo = data;
    });

    const events = table.children;
    for (var i = 0; i < events.length; i++) {
      const event = events[i];
      const title = event.querySelector("name").getAttribute("value");
      const times = event.querySelector("time").children;
      for (var j = 0; j < times.length; j++) {
        const time = times[j];
        const day = time.getAttribute("day");
        const start = timecodeToString(time.getAttribute("starttime"));
        const end = timecodeToString(time.getAttribute("endtime"));
        const location = time.getAttribute("place");

        icalText += createEvent(title, start, end, day, semesterInfo, location);
      }
    }
    icalText += "END:VCALENDAR";

    var blob = new Blob([icalText], {
      type: "text/calendar;charset=utf-8",
    });
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

  function timecodeToString(timecode) {
    var hour = (timecode / 12).toString();
    var minute = ((timecode % 12) * 5).toString();

    if (hour.length == 1) {
      hour = "0" + hour;
    }
    if (minute.length == 1) {
      minute = "0" + minute;
    }
    return hour + minute;
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
