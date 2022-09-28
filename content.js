$().ready(function () {
  $.get(chrome.runtime.getURL('/icalUI.html'), function (data) {
    htmlInject(data);
    formatterInit($("#subjectFormatters"), $("#icalTitle"));
    formatterInit($("#descriptionFormatters"), $("#icalDescription"));
    moveElementToCenter($("#tableCustom"));
  });

  createButton("iCal", "tableCustom", "light image export").appendTo(
    "#container > aside > div.title > ol"
  );
  $('[data-modal="tableCustom"]').on("click", async () => {
    // const table = await new Table();
    // const ical = new Ical(table);
    // downloadIcal(ical);
    var $modalwrap = $("<div></div>").addClass("modalwrap");
    $modalwrap.on("click", function () {
      $("div.modalwrap").remove();
      $("#tableCustom").hide();
    });
    $modalwrap.insertBefore($("#tableCustom"));
    $("#tableCustom").show();
  });
});

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

