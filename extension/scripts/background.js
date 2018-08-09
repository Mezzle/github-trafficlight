let currentStatus = '';
let currentStatusText = '';

const statusImages = {
  good: 'images/status-icon-green.png',
  minor: 'images/status-icon-orange.png',
  major: 'images/status-icon-red.png'
};

const checkStatus = async (initial = false) =>
  fetch('https://status.github.com/api/last-message.json')
    .then(response => response.json())
    .then(data => {
      const status = data.status;
      const statusText = data.body.trim();
      let statusChanged = false;

      if (status !== currentStatus) {
        chrome.browserAction.setIcon({ path: statusImages[status] });

        currentStatus = status;
        statusChanged = true;
      }

      if (statusText !== currentStatusText) {
        chrome.browserAction.setTitle({ title: statusText });

        currentStatusText = statusText;
        statusChanged = true;
      }

      if (statusChanged && !initial) {
        chrome.notifications.create('githubStatus', {
          type: 'basic',
          iconUrl: statusImages[currentStatus],
          message: currentStatusText,
          title: 'Github status update'
        });
      }
    });

// Manage Alarm

chrome.alarms.create('checkGithubStatus', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'checkGithubStatus') {
    checkStatus();
  }
});

// Push Button!

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'https://status.github.com/' });
});

// Initial Check

checkStatus(true);
