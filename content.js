let adBlockEnabled = false;

function blockAds() {
    const adSelectors = [
        'div[id^="google_ads_"]',
        'ins.adsbygoogle',
        'div[id^="ad-"]',
        'div[class*="ad-"]',
        'div[class*="ads-"]',
        'div[class*="advertisement"]',
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="googleadservices.com"]',
        // Add more selectors as needed
    ];

    adSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = 'none';
        });
    });
}

function showAds() {
    const adSelectors = [
        'div[id^="google_ads_"]',
        'ins.adsbygoogle',
        'div[id^="ad-"]',
        'div[class*="ad-"]',
        'div[class*="ads-"]',
        'div[class*="advertisement"]',
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="googleadservices.com"]',
        // Add more selectors as needed
    ];

    adSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.display = '';
        });
    });
}

function handleAdBlocking() {
    if (adBlockEnabled) {
        blockAds();
    } else {
        showAds();
    }
}

// Initial check and setup
chrome.storage.sync.get('adBlockEnabled', function(data) {
    adBlockEnabled = data.adBlockEnabled;
    handleAdBlocking();
});

// Listen for changes in ad blocking state
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.adBlockEnabled !== undefined) {
        adBlockEnabled = request.adBlockEnabled;
        handleAdBlocking();
    }
});

// Set up a MutationObserver to handle dynamically loaded ads
const observer = new MutationObserver(function(mutations) {
    if (adBlockEnabled) {
        blockAds();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
