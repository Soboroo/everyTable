console.log("content.js loaded");
console.log(document);

// html에 script.js 추가
var s = document.createElement("script");
s.src = chrome.runtime.getURL("script.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
