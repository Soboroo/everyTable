const iCalButtonLocation = "#container > aside > div.title > ol";

$().ready(function () {
  iCalUiAttach();
  createButton("iCal", "tableCustom", "light image export").appendTo(iCalButtonLocation);
  $('[data-modal="tableCustom"]').on("click", async () => {openIcalUi();});
});

async function openIcalUi() {
  const table = await new Table();
  const ical = new Ical(table);
  downloadIcal(ical);
}

function iCalUiAttach() {
  $.get(chrome.runtime.getURL('/icalUI.html'), function (data) {
    htmlInject(data);
    formatterInit($("#subjectFormatters"), $("#icalTitle"));
    formatterInit($("#descriptionFormatters"), $("#icalDescription"));
    moveElementToCenter($("#tableCustom"));
  });
}

function moveElementToCenter($element) {
  $element.css({
    "margin-left": -($element.outerWidth() / 2),
    "margin-top": -($element.outerHeight() / 2),
    "display": "none"
  });
}

function createButton(text, liModal, aClass, handler) {
  const $newButton = $("<li>").attr("data-modal", liModal);
  $newButton.click(handler);

  const $a = $("<a>").addClass(aClass).text(text);

  $newButton.append($a);
  return $newButton;
}

function downloadIcal(ical) {
  const url = ical.createIcalURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = ical.table.year + "년 " + ical.table.semester + "학기_" + ical.table.name + ".ics";
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
function htmlInject(data) {
  $($.parseHTML(data)).appendTo('#container');

  $("a.close", "#tableCustom").on("click", function () {
    $("div.modalwrap").remove();
    $("#tableCustom").hide();
  });
}

