function formatterInit($formatters, $textarea) {
	var formattingLatters = ["\\t", "\\p", "\\w", "\\c", "\\l", "\\i"];
	for (let i = 0; i < $formatters.children().length; i++) {
		$formatters.children().eq(i).on("click", () => {
			$textarea.val($textarea.val() + formattingLatters[i]);
			$textarea.focus();
		});
	}
}
