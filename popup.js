document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('adBlockToggle');
    const status = document.getElementById('status');
    const enabledPopup = document.getElementById('enabledPopup');
    const disabledPopup = document.getElementById('disabledPopup');

    // Load the current state
    chrome.storage.sync.get('adBlockEnabled', function(data) {
        updateUI(data.adBlockEnabled);
    });

    toggle.addEventListener('change', function() {
        const enabled = toggle.checked;
        chrome.storage.sync.set({adBlockEnabled: enabled}, function() {
            updateUI(enabled);
        });

        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {adBlockEnabled: enabled});
        });
    });

    function updateUI(enabled) {
        toggle.checked = enabled;
        updateStatus(enabled);
        showPopup(enabled);
        toggle.disabled = false; // Enable the toggle after updating UI
    }

    function updateStatus(enabled) {
        status.textContent = enabled ? 'Ad Blocker: On' : 'Ad Blocker: Off';
    }

    function showPopup(enabled) {
        if (enabled) {
            enabledPopup.style.display = 'block';
            disabledPopup.style.display = 'none';
            setTimeout(() => {
                enabledPopup.style.display = 'none';
            }, 5000);
        } else {
            enabledPopup.style.display = 'none';
            disabledPopup.style.display = 'block';
            setTimeout(() => {
                disabledPopup.style.display = 'none';
            }, 5000);
        }
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "updatePopup") {
            updateUI(request.adBlockEnabled);
        }
    });
});
