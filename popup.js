const $enabled = document.getElementById('enabled');

chrome.storage.local.get("windowId", ({ windowId }) => {
  chrome.windows.getCurrent({}, (windowInfo) => {
    // initialize value
    $enabled.checked = windowId === windowInfo.id;

    $enabled.addEventListener("click", async (e) => {
      const enabled = e.target.checked;
      chrome.runtime.sendMessage({
        type: "refresh", enabled, windowId: windowInfo.id });
    });
  });
});
