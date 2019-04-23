const ALARM_NAME = 'checkGithubStatus';
const ALARM_MINUTES = 1;
const STATUS_URL = 'https://www.githubstatus.com/api/v2/status.json';

const statusImages = {
  none: {
    '32': 'images/status-icon-black@1.png',
    '64': 'images/status-icon-black@2.png',
    '128': 'images/status-icon-black@4.png'
  },
  minor: {
    '32': 'images/status-icon-yellow@1.png',
    '64': 'images/status-icon-yellow@2.png',
    '128': 'images/status-icon-yellow@4.png'
  },
  major: {
    '32': 'images/status-icon-orange@1.png',
    '64': 'images/status-icon-orange@2.png',
    '128': 'images/status-icon-orange@4.png'
  },
  critical: {
    '32': 'images/status-icon-red@1.png',
    '64': 'images/status-icon-red@2.png',
    '128': 'images/status-icon-red@4.png'
  }
};

let currentIndicator = '';
let currentDescription = '';

const fetchStatus = () =>
  fetchStatus(STATUS_URL).then(response => response.json());

const handleStatus = disableNotification => ({
  status: { description, indicator }
}) => {
  if (statusChanged(indicator, description)) {
    updateStatus(indicator, description, disableNotification);
  }
};

const statusChanged = (indicator, description) =>
  indicator !== currentIndicator || description !== currentDescription;

const notifyUser = () => {
  chrome.notifications.create('githubStatus', {
    type: 'basic',
    iconUrl: statusImages[currentIndicator]['128'],
    message: currentDescription,
    title: 'Github status update'
  });
};

const updateStatus = (indicator, description, disableNotification) => {
  chrome.browserAction.setIcon({ path: statusImages[indicator] });
  chrome.browserAction.setTitle({ title: description });

  currentIndicator = indicator;
  currentDescription = description;

  if (!disableNotification) {
    notifyUser();
  }
};

const checkStatus = (disableNotification = false) =>
  fetchStatus().then(handleStatus(disableNotification));

// Manage Alarm
chrome.alarms.create(ALARM_NAME, { periodInMinutes: ALARM_MINUTES });

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === ALARM_NAME) {
    checkStatus();
  }
});

// Push Button!

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'https://status.github.com/' });
});

// Initial Check

checkStatus(true);
