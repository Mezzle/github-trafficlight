let currentStatus = '';
let currentStatusText = '';

const checkStatus = async () => {
  return fetch('https://status.github.com/api/last-message.json')
    .then(response => {
      return response.json();
    })
    .then(data => {
      const status = data.status;
      const statusText = data.body.trim();

      if (status !== currentStatus) {
        switch (status) {
          case 'good':
        }
        if (status === 'good') {
          chrome.browserAction.setIcon({
            path: 'images/status-icon-green.png'
          });
        } else if (status === 'minor') {
          chrome.browserAction.setIcon({
            path: 'images/status-icon-orange.png'
          });
        } else {
          chrome.browserAction.setIcon({
            path: 'images/status-icon-red.png'
          });
        }

        currentStatus = status;
      }

      if (statusText !== currentStatusText) {
        chrome.browserAction.setTitle({ title: statusText });
        currentStatusText = statusText;
      }
    });
};

// Manage Alarm

chrome.alarms.create('checkGithubStatus', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'checkGithubStatus') {
    checkStatus();
  }
});

// Push Button!

chrome.browserAction.onClicked.addListener(() => {
  const url = 'https://status.github.com/';
  chrome.tabs.create({ url: url });
});

// Initial Check

checkStatus();
