$(function () {
    var currentStatus = '';
    var currentStatusText = '';

    // Check Status

    var checkStatus = function () {
        $.get('https://status.github.com/api/last-message.json', function (data) {
            var status = data.status;
            var statusText = data.body.trim();
            
            if (status != currentStatus) {
                if (status == 'good') {
                    chrome.browserAction.setIcon({path: "images/status-icon-green.png"});
                } else if (status == 'minor') {
                    chrome.browserAction.setIcon({path: "images/status-icon-orange.png"});
                } else {
                    chrome.browserAction.setIcon({path: "images/status-icon-red.png"});
                }

                currentStatus = status;
            }
            
            if (statusText != currentStatusText) {
                chrome.browserAction.setTitle({title: statusText});
                currentStatusText = statusText;
            }
        });
    };
    
    // Manage Alarm

    chrome.alarms.create('checkGithubStatus', {periodInMinutes: 1});

    chrome.alarms.onAlarm.addListener(function (alarm) {
        if (alarm.name == 'checkGithubStatus') {
            checkStatus();
        }
    });

    // Push Button!

    chrome.browserAction.onClicked.addListener(function () {
        var url = "https://status.github.com/";
        chrome.tabs.create({url: url});
    });

    // Initial Script

    checkStatus();
});


