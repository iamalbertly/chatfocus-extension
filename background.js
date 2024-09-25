chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    focusedContacts: [],
    filterSettings: {
      ignoreForwarded: false,
      includeUserMentions: true
    },
    usageStats: {
      extensionOpens: 0,
      filterUsed: 0,
      exportsRequested: 0
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateUsageStats") {
    chrome.storage.sync.get("usageStats", (data) => {
      const updatedStats = { ...data.usageStats, ...request.stats };
      chrome.storage.sync.set({ usageStats: updatedStats });
    });
  }
});

// Add more background functionality as needed
