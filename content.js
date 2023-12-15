// Content script logic
console.log('Content Script Loaded');

// Send a message to the background script
chrome.runtime.sendMessage({ contentScriptLoaded: true });
