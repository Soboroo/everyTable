$().ready(function () {
  createForm("iCal", "tableCustom", "Export").appendTo("#container");
  $("tableCustom").removeAttr("style");

  createButton("iCal", "tableCustom", "light image setting").appendTo(
    "#container > aside > div.title > ol"
  );
  $('[data-modal="tableCustom"]').on("click", () => {
    var $modal = $("#tableCustom");
    var $modalwrap = $("<div></div>").addClass("modalwrap");
    $modalwrap.on("click", function () {
      $("div.modalwrap").remove();
      $("#tableCustom").hide();
    });
    $modalwrap.insertBefore($modal);
    $modal.css({
      "margin-left": -($modal.outerWidth() / 2),
      "margin-top": -($modal.outerHeight() / 2),
    });
    $("#tableCustom").show();
  });
  $("a.close", "#tableCustom").on("click", function () {
    $("div.modalwrap").remove();
    $("#tableCustom").hide();
  });

  function createButton(text, liModal, aClass, handler) {
    const $newButton = $("<li>").attr("data-modal", liModal);
    $newButton.click(handler);

    const $a = $("<a>").addClass(aClass).text(text);

    $newButton.append($a);
    return $newButton;
  }

  function createForm(text, id, submitButtonText = null, handler = null) {
    const $form = $("<form>").attr("id", id).addClass("modal");
    const $header = $("<h3>").text(text);

    const $closeButton = $("<a>").addClass("close");
    $closeButton.click(() => {
      $("#" + id).hide();
    });
    const $content = $("<p>");

    $form.append($closeButton);
    $form.append($header);
    $form.append($content);

    if (submitButtonText !== null) {
      const $submitButton = $("<input>")
        .attr("type", "button")
        .val(submitButtonText)
        .addClass("button");
      $submitButton.click(handler);
      $form.append($submitButton);
    }

    return $form;
  }
});
