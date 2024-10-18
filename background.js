chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({adBlockEnabled: false}, function() {
        console.log("AdVanish initialized with ad blocking disabled.");
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        // Check the current state of ad blocking
        chrome.storage.sync.get('adBlockEnabled', function(data) {
            // Send message to content script to update ad blocking state
            chrome.tabs.sendMessage(tabId, {adBlockEnabled: data.adBlockEnabled}, function(response) {
                if (chrome.runtime.lastError) {
                    // Handle potential errors, e.g., content script not ready
                    console.log("Error sending message to content script:", chrome.runtime.lastError);
                }
            });
            
            // Update popup if it's open
            chrome.runtime.sendMessage({action: "updatePopup", adBlockEnabled: data.adBlockEnabled}, function(response) {
                if (chrome.runtime.lastError) {
                    // Popup is not open, ignore the error
                    console.log("Popup is not open, skipping update");
                }
            });
        });
    }
});
