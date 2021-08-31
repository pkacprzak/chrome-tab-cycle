const defaultToggleInterval = 5;  // 5s

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ toggleInterval: defaultToggleInterval });
  chrome.storage.local.set({ windowId: null });
});

let curTabIndex = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "refresh" ) {
    const { enabled } = request;
    curTabIndex = 0; // always reset to the first tab on refresh request
    if (enabled) {
      chrome.storage.local.set({ windowId: request.windowId }, () => {
        run();
      });
    } else {
      chrome.storage.local.set({ windowId: null });
    }
  }
});

const cycleTab = () => {
  chrome.storage.local.get("windowId", ({ windowId }) => {
    if (windowId === null) {
      return;
    }
    chrome.tabs.query({windowId}, (foundTabs) => {
      if (foundTabs.length === 0) {
        // no tabs, probably window got closed;
        chrome.storage.local.set({ windowId: null });
        return;
      }
      curTabIndex += 1;
      if (curTabIndex === foundTabs.length) {
        curTabIndex = 0;
      }
      chrome.tabs.update(foundTabs[curTabIndex].id, {active: true})
      run();
    });
  });
}

const run = () => {
  chrome.storage.local.get("toggleInterval", ({ toggleInterval }) => {
    setTimeout(cycleTab, toggleInterval * 1000);
  });
}
