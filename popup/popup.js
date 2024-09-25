console.log('ChatFocus: popup.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('ChatFocus: Popup DOM loaded');
  
  const addContactBtn = document.getElementById('add-contact-btn');
  const addContactInput = document.getElementById('add-contact-input');
  const focusedContactsList = document.getElementById('focused-contacts-list');
  const ignoreForwardedCheckbox = document.getElementById('ignore-forwarded');
  const includeMentionsCheckbox = document.getElementById('include-mentions');
  const exportBtn = document.getElementById('export-btn');
  const feedbackBtn = document.getElementById('feedback-btn');

  // Load focused contacts and filter settings
  chrome.storage.sync.get(['focusedContacts', 'filterSettings'], (data) => {
    console.log('ChatFocus: Loaded storage data', data);
    
    // Populate focused contacts list
    data.focusedContacts = data.focusedContacts || [];
    data.focusedContacts.forEach(contact => {
      addContactToList(contact);
    });

    // Set filter settings
    if (data.filterSettings) {
      ignoreForwardedCheckbox.checked = data.filterSettings.ignoreForwarded;
      includeMentionsCheckbox.checked = data.filterSettings.includeUserMentions;
    }
  });

  // Add contact
  addContactBtn.addEventListener('click', () => {
    const contact = addContactInput.value.trim();
    if (contact) {
      console.log('ChatFocus: Adding new contact', contact);
      chrome.storage.sync.get('focusedContacts', (data) => {
        const updatedContacts = [...(data.focusedContacts || []), contact];
        chrome.storage.sync.set({ focusedContacts: updatedContacts }, () => {
          addContactToList(contact);
          addContactInput.value = '';
          updateContentScript(updatedContacts);
        });
      });
    }
  });

  // Update filter settings
  ignoreForwardedCheckbox.addEventListener('change', updateFilterSettings);
  includeMentionsCheckbox.addEventListener('change', updateFilterSettings);

  // Export conversations
  exportBtn.addEventListener('click', () => {
    console.log('ChatFocus: Export button clicked');
    // Implement export functionality
    updateUsageStats({ exportsRequested: 1 });
  });

  // Send feedback
  feedbackBtn.addEventListener('click', () => {
    console.log('ChatFocus: Feedback button clicked');
    const mailtoLink = 'mailto:r.lyatuu@gmail.com?subject=ChatFocus%20Feedback';
    chrome.tabs.create({ url: mailtoLink });
  });

  // Helper functions
  function addContactToList(contact) {
    console.log('ChatFocus: Adding contact to list', contact);
    const li = document.createElement('li');
    li.textContent = contact;
    focusedContactsList.appendChild(li);
  }

  function updateFilterSettings() {
    console.log('ChatFocus: Updating filter settings');
    const filterSettings = {
      ignoreForwarded: ignoreForwardedCheckbox.checked,
      includeUserMentions: includeMentionsCheckbox.checked
    };
    chrome.storage.sync.set({ filterSettings });
  }

  function updateUsageStats(stats) {
    console.log('ChatFocus: Updating usage stats', stats);
    chrome.runtime.sendMessage({ action: "updateUsageStats", stats });
  }

  function updateContentScript(focusedContacts) {
    console.log('ChatFocus: Updating content script with focused contacts', focusedContacts);
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateFocusedContacts',
        focusedContacts: focusedContacts
      });
    });
  }

  // Update usage stats for extension open
  updateUsageStats({ extensionOpens: 1 });
});