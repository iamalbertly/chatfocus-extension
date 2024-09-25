console.log('ChatFocus: content.js loaded');

// Create and append the ChatFocus UI
function createChatFocusUI() {
  console.log('ChatFocus: Creating UI');
  const chatFocusUI = document.createElement('div');
  chatFocusUI.id = 'chat-focus-ui';
  chatFocusUI.innerHTML = `
    <div id="chat-focus-header">
      <h2>ChatFocus</h2>
      <button id="chat-focus-minimize">-</button>
    </div>
    <div id="chat-focus-content">
      <div id="focused-contacts">
        <h3>Focused Contacts</h3>
        <ul id="focused-contacts-list"></ul>
      </div>
      <div id="group-filter">
        <h3>Group Filter</h3>
        <input type="text" id="group-filter-input" placeholder="Filter by contact name">
        <button id="apply-filter">Apply</button>
      </div>
    </div>
  `;
  document.body.appendChild(chatFocusUI);
  console.log('ChatFocus: UI created and appended to body');
}

// Toggle ChatFocus UI visibility
function toggleChatFocusUI() {
  const chatFocusUI = document.getElementById('chat-focus-ui');
  const minimizeButton = document.getElementById('chat-focus-minimize');
  
  if (chatFocusUI.classList.contains('minimized')) {
    chatFocusUI.classList.remove('minimized');
    minimizeButton.textContent = '-';
    console.log('ChatFocus: UI expanded');
  } else {
    chatFocusUI.classList.add('minimized');
    minimizeButton.textContent = '+';
    console.log('ChatFocus: UI minimized');
  }
}

// Filter group chats
function filterGroupChat() {
  console.log('ChatFocus: Filtering group chat');
  const filterInput = document.getElementById('group-filter-input');
  const filterText = filterInput.value.toLowerCase();
  
  // This is a placeholder implementation. You'll need to adapt this to work with WhatsApp Web's DOM structure.
  const messages = document.querySelectorAll('.message-in, .message-out');
  messages.forEach(message => {
    const sender = message.querySelector('.sender-name');
    if (sender) {
      const senderName = sender.textContent.toLowerCase();
      if (senderName.includes(filterText)) {
        message.style.opacity = '1';
      } else {
        message.style.opacity = '0.5';
      }
    }
  });
  
  console.log(`ChatFocus: Applied filter "${filterText}"`);
}

// Main initialization
function init() {
  console.log('ChatFocus: Initializing');
  createChatFocusUI();
  
  // Add event listeners
  const minimizeButton = document.getElementById('chat-focus-minimize');
  minimizeButton.addEventListener('click', toggleChatFocusUI);
  
  const applyFilterButton = document.getElementById('apply-filter');
  applyFilterButton.addEventListener('click', filterGroupChat);
  
  console.log('ChatFocus: Initialization complete');
}

// Run the initialization when the page is fully loaded
window.addEventListener('load', () => {
  console.log('ChatFocus: Window loaded, running init');
  init();
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('ChatFocus: Received message', request);
  if (request.action === 'updateFocusedContacts') {
    updateFocusedContactsList(request.focusedContacts);
  }
});

// Update the focused contacts list in the UI
function updateFocusedContactsList(contacts) {
  console.log('ChatFocus: Updating focused contacts list', contacts);
  const list = document.getElementById('focused-contacts-list');
  list.innerHTML = '';
  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.textContent = contact;
    list.appendChild(li);
  });
}