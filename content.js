$().ready(function () {
  createButton("iCal", "tableCustom", "light image setting").appendTo(
    "#container > aside > div.title > ol"
  );
  $('[data-modal="tableCustom"]').on("click", async () => {
    const table = await new Table();
    const ical = new Ical(table);
    const url = ical.createIcalURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = table.year + "년 " + table.semester + "학기_" + table.name + ".ics";
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  });

  function createButton(text, liModal, aClass, handler) {
    const $newButton = $("<li>").attr("data-modal", liModal);
    $newButton.click(handler);

    const $a = $("<a>").addClass(aClass).text(text);

    $newButton.append($a);
    return $newButton;
  }
});
