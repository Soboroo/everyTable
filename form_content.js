$().ready(function () {
  const button = $('<a href="javascript:;">Download</a>');
  button.click(async function () {
    const table = await new Table();
    const url = table.createIcalURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = table.year + "년 " + table.semester + "학기_" + table.name + ".ics";
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
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

  class Table {
    constructor(tableId = document
      .querySelector("#container > aside > div.menu > ol > li.active > a")
      .href.split("/")
      .reverse()[0]) {
      return (async () => {
        let requestURL =
          "https://api.everytime.kr/find/timetable/table?id=" + tableId;

        let response = await fetch(requestURL, { credentials: "include" });
        let rawText = await response.text();

        const tableXml = new DOMParser().parseFromString(rawText, "text/xml").querySelector("table");
        this.name = tableXml.getAttribute("name");
        this.year = tableXml.getAttribute("year");
        this.semester = tableXml.getAttribute("semester");

        requestURL =
          "https://api.everytime.kr/find/timetable/subject/semester/list";

        response = await fetch(requestURL, { credentials: "include" });
        rawText = await response.text();

        const semesterXml = new DOMParser().parseFromString(rawText, "text/xml");

        for (let date of semesterXml.querySelector("response").children) {
          if (date.getAttribute("year") == this.year && date.getAttribute("semester") == this.semester) {
            this.startDate = new Date(date.getAttribute("start_date") + " 00:00:00");
            this.endDate = new Date(date.getAttribute("end_date") + " 00:00:00");
            break;
          }
        }

        this.items = [];
        const events = tableXml.children;
        for (let event of events) {
          for (let time of event.querySelector("time").children) {
            this.items.push({
              title: event.querySelector("name").getAttribute("value"),
              credit: event.querySelector("credit").getAttribute("value"),
              day: time.getAttribute("day"),
              start: time.getAttribute("starttime"),
              end: time.getAttribute("endtime"),
              location: time.getAttribute("place"),
            });
          }
        }

        return this;
      })();
    }

    createIcalURL() {
      let icalText =
        "BEGIN:VCALENDAR\r\n" +
        "VERSION:2.0\r\n" +
        "PRODID:-//everyTable//everytime timetable maker//KO\r\n";

      const day = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
      let until = new Date(this.endDate);
      until.setDate(until.getDate() + 1);
      const untilString = this.getDateString(until, 0, 3);
      for (let item of this.items) {
        let start = new Date(this.startDate);
        start.setDate(start.getDate() + ((item.day - start.getDay() + 8) % 7));
        const startString = this.getDateString(start, 0, 3);

        let event = "BEGIN:VEVENT\r\n";
        event += "SUMMARY:" + item.title + "\r\n";
        event += "DTSTART:" + startString + "T" + this.timecodeToString(item.start) + "\r\n";
        event += "DTEND:" + startString + "T" + this.timecodeToString(item.end) + "\r\n";
        event += "RRULE:FREQ=WEEKLY;BYDAY=" + day[item.day] + ";UNTIL=" + untilString + "T000000\r\n";
        event += "LOCATION:" + item.location + "\r\n";
        event += "UID:" + this.getUUID() + "\r\n";
        event += "DTSTAMP:" + this.getDateString(new Date(), 0, 3) + "T" + this.getDateString(new Date(), 3, 6) + "\r\n";
        event += "END:VEVENT\r\n";

        icalText += event;
      }
      icalText += "END:VCALENDAR";
      console.log(icalText);
      var blob = new Blob([icalText], {
        type: "text/calendar;charset=utf-8",
      });
      var url = URL.createObjectURL(blob);
      return url;
    }

    timecodeToString(timecode) {
      let hour = Math.floor(timecode / 12).toString();
      let minute = ((timecode % 12) * 5).toString();

      if (hour.length == 1) {
        hour = "0" + hour;
      }
      if (minute.length == 1) {
        minute = "0" + minute;
      }
      return hour + minute + "00";
    }

    getUUID() {
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

    getDateString(time, start, end) {
      let format = [];

      format.push(time.getFullYear());
      format.push(("0" + (time.getMonth() + 1)).slice(-2));
      format.push(("0" + time.getDate()).slice(-2));
      format.push(("0" + time.getHours()).slice(-2));
      format.push(("0" + time.getMinutes()).slice(-2));
      format.push(("0" + time.getSeconds()).slice(-2));

      return format.slice(start, end).join("");
    }

    test() {
      console.log(this.xml);
    }
  };
});
