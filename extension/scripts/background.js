chrome.browserAction.onClicked.addListener(function (activeTab) {
    var url = "https://status.github.com/";
    chrome.tabs.create({url: url});
});

function checkStatus() {
    $.get('https://status.github.com/api/last-message.json', function (data) {
        if (data.status == 'good') {
            chrome.browserAction.setIcon({path: "images/status-icon-green.png"});
        } else if (data.status == 'minor') {
            chrome.browserAction.setIcon({path: "images/status-icon-orange.png"});
        } else {
            chrome.browserAction.setIcon({path: "images/status-icon-red.png"});
        }

        chrome.browserAction.setTitle({title: data.body});
    });
}
checkStatus();
setInterval(checkStatus, 3000);
