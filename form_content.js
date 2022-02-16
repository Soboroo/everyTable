$().ready(function () {
  const button = $('<a href="javascript:;">Download</a>');
  button.click(async function () {
    await getTableXML().then(async function (table) {
      const year = table.getAttribute("year");
      const semester = table.getAttribute("semester");
      const name = table.getAttribute("name");
      await createiCalURL(table).then(function (url) {
        console.log(url);
        const a = document.createElement("a");
        a.href = url;
        a.download = year + "년 " + semester + "학기_" + name + ".ics";
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
    });
  });
  $("#tableCustom").children("p").append(button);

  $("#tableCustom > h3").after("<div class='ical1'>");

  $("#tableCustom > div.ical1").append('<div id="icalTitle">');
  const title = $("#icalTitle");
  title.append("<label>제목</label>");
  title.append(
    '<input type="text" name="title" value maxlength="40" class="text">'
  );
  title.append('<ul class="format">');
  for (const x of [
    "과목명",
    "교수명",
    "강의실",
    "전공/교양",
    "학점",
    "과목코드",
  ]) {
    $("#icalTitle > ul.format").append("<a>" + x + "</a>");
  }

  $("#tableCustom > div.ical1").append('<div id="icalDescription">');
  const desc = $("#icalDescription");
  desc.append("<label>설명</label>");
  desc.append(
    '<input type="text" name="title" value maxlength="40" class="text">'
  );
  desc.append('<ul class="format">');
  for (const x of ["Sample1", "Sample2", "Sample3"]) {
    $("#icalDescription > ul.format").append("<a>" + x + "</a>");
  }

  $("#tableCustom > div.ical1").append('<div id="icalPlace">');
  const place = $("#icalPlace");
  place.append("<label>장소</label>");
  place.append('<input type="checkbox" checked="checked"></input>');
  place.append('<label class="checkbox">장소란에 강의실 삽입</label>');

  $("#tableCustom > div.ical1").append('<div id="icalTime">');
  const time = $("#icalTime");
  time.append("<label>시간</label>");
  time.append("<a>시작일 </a>");
  time.append(
    '<input type="date" name="start" value="2018-01-01" class="date"><br>'
  );
  time.append("<a>종료일 </a>");
  time.append('<input type="date" name="end" value="2018-01-01" class="date">');

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
    var ret = "BEGIN:VEVENT\r\n";
    ret += "SUMMARY:" + title + "\r\n";
    ret += "DTSTART:" + semesterInfo.start_date + "T" + start + "00\r\n";
    ret += "DTEND:" + semesterInfo.start_date + "T" + end + "00\r\n";
    ret +=
      "RRULE:FREQ=WEEKLY;BYDAY=" +
      day[dayIndex] +
      ";UNTIL=" +
      semesterInfo.end_date +
      "T235959\r\n";
    ret += "UID:" + getUUID() + "\r\n";
    if (location !== null) {
      ret += "LOCATION:" + location + "\r\n";
    }
    if (description !== null) {
      ret += "DESCRIPTION:" + description + "\r\n";
    }
    ret += "DTSTAMP:" + getCurrentTime() + "\r\n";
    ret += "END:VEVENT\r\n";
    return ret;
  }
  async function createiCalURL(table) {
    var icalText =
      "BEGIN:VCALENDAR\r\n" +
      "VERSION:2.0\r\n" +
      "PRODID:-//everyTable//everytime timetable maker//KO\r\n";
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
    var hour = Math.floor(timecode / 12).toString();
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

  function getCurrentTime() {
    var today = new Date();

    var year = today.getFullYear();
    var month = ("0" + (today.getMonth() + 1)).slice(-2);
    var day = ("0" + today.getDate()).slice(-2);
    var hours = ("0" + today.getHours()).slice(-2);
    var minutes = ("0" + today.getMinutes()).slice(-2);
    var seconds = ("0" + today.getSeconds()).slice(-2);

    return year + month + day + "T" + hours + minutes + seconds;
  }
});
