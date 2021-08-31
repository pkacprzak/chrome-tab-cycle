const $interval = document.getElementById('toggleInterval');

chrome.storage.local.get("toggleInterval", ({ toggleInterval }) => {
  // initialize value
  $interval.value = toggleInterval;

  $interval.addEventListener("change", async (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      // do nothing with non-number values
      return;
    }
    chrome.storage.local.set({ toggleInterval: e.target.value });
  });
});
