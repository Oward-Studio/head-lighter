function updateIcon(tabId, isEnabled) {
  const iconPath = isEnabled
    ? {
        16: "icon-on-16.png",
        32: "icon-on-32.png",
        48: "icon-on-48.png",
        128: "icon-on-128.png",
      }
    : {
        16: "icon-off-16.png",
        32: "icon-off-32.png",
        48: "icon-off-48.png",
        128: "icon-off-128.png",
      };

  chrome.action.setIcon({
    tabId: tabId,
    path: iconPath,
  });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.session.get(["highlightEnabled"], (result) => {
    const isEnabled =
      result.highlightEnabled === undefined ? false : result.highlightEnabled; // Default to false
    const newEnabledState = !isEnabled;

    chrome.storage.session.set({ highlightEnabled: newEnabledState }, () => {
      updateIcon(tab.id, newEnabledState);
      chrome.tabs.sendMessage(tab.id, {
        message: "toggleHighlight",
        highlightEnabled: newEnabledState,
      });
    });
  });
});

// Update icon when a tab is activated (e.g., when the user switches tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.storage.session.get(["highlightEnabled"], (result) => {
    const isEnabled =
      result.highlightEnabled === undefined ? false : result.highlightEnabled; // Default to false
    updateIcon(activeInfo.tabId, isEnabled);
  });
});

// Update icon when a tab is updated (e.g., when the page is reloaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.session.get(["highlightEnabled"], (result) => {
      const isEnabled =
        result.highlightEnabled === undefined ? false : result.highlightEnabled; // Default to false
      updateIcon(tabId, isEnabled);
    });
  }
});

// Set initial icon when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.session.set({ highlightEnabled: false }, () => {
    // Default to disabled on install
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        updateIcon(tab.id, false);
      });
    });
  });
});
