$(function () {
    var currentStatus = '';

    // Check Status

    var checkStatus = function () {
        $.get('https://status.github.com/api/last-message.json', function (data) {
            if (data.status != currentStatus) {
                if (data.status == 'good') {
                    chrome.browserAction.setIcon({path: "images/status-icon-green.png"});
                } else if (data.status == 'minor') {
                    chrome.browserAction.setIcon({path: "images/status-icon-orange.png"});
                } else {
                    chrome.browserAction.setIcon({path: "images/status-icon-red.png"});
                }

                currentStatus = data.status;
            }

            chrome.browserAction.setTitle({title: data.body.trim()});
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


