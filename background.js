// chrome extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log(tab.url);
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   function: reddenPage,
  // });
});
