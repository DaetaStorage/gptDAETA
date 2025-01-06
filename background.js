chrome.runtime.onInstalled.addListener(async () => {
  chrome.tabs.create({
    url: "https://chatgpt.com",
  });
});

function reddenPage() {
  console.log("ChatGpt is loaded");
}

chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked!");
  if (!tab.url.includes("chrome://")) {
    // Create the new tab and wait for it to fully load
    chrome.tabs.create(
      {
        url: "https://chatgpt.com",
      },
      function (newTab) {
        console.log("New tab created: ", newTab);
        // Wait for the tab to be fully loaded
        chrome.tabs.onUpdated.addListener(function onUpdated(
          tabId,
          changeInfo
        ) {
          console.log("Tab updated: ", tabId, changeInfo);
          if (tabId === newTab.id && changeInfo.status === "complete") {
            // Inject the script once the tab is fully loaded
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              function: reddenPage,
            });
            console.log("Script injected into tab: ", tabId);

            // Remove the listener once we have executed the script
            chrome.tabs.onUpdated.removeListener(onUpdated);
          }
        });
      }
    );
  }
});

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message.type === "GET_USER_INFO") {
      // Perform the fetch request
      fetch(message.url, message.options)
        .then((response) => response.json()) // Adjust this if you expect a different response type
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.toString() })
        );

      // Required to return true when using async response
      return true;
    } else if (message.type === "VERIFY_REFERRAL_CODE") {
      // Perform the fetch request
      fetch(message.url, message.options)
        .then((response) => response.json()) // Adjust this if you expect a different response type
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.toString() })
        );

      // Required to return true when using async response
      return true;
    } else if (message.type === "VERIFY_OTP_CODE") {
      // Perform the fetch request
      fetch(message.url, message.options)
        .then((response) => response.json()) // Adjust this if you expect a different response type
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.toString() })
        );

      // Required to return true when using async response
    } else if (message.type === "CLAIM_REWARDS") {
      // Perform the fetch request
      fetch(message.url, message.options)
        .then((response) => response.json()) // Adjust this if you expect a different response type
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.toString() })
        );

      // Required to return true when using async response
      return true;
    } else if (message.type === "CLAIM_POINTS") {
      // Perform the fetch request
      fetch(message.url, message.options)
        .then((response) => response.json()) // Adjust this if you expect a different response type
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.toString() })
        );

      // Required to return true when using async response
      return true;
    } else if (message.type === "CLAIMED_POINTS") {
      // Perform the fetch request
      fetch(message.url, message.options)
        .then((response) => response.json()) // Adjust this if you expect a different response type
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.toString() })
        );

      // Required to return true when using async response
      return true;
    } else if (message.type === "GET_SIGNATURE") {
      // Perform the fetch request
      fetch(message.url, message.options)
        .then((response) => response.json()) // Adjust this if you expect a different response type
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.toString() })
        );

      // Required to return true when using async response
      return true;
    } else if (message.type === "GET_PRICE") {
      // Perform the fetch request
      fetch(message.url, message.options)
        .then((response) => response.json()) // Adjust this if you expect a different response type
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.toString() })
        );

      // Required to return true when using async response
      return true;
    }
  }
);
