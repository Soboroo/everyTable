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
});
