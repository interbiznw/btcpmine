const url = require('url');
const path = require('path');
const {app, BrowserWindow, dialog, autoUpdater} = require('electron');

let win;

const {version} = require('./package.json');

const server = 'http://zfaucet.org:3005';
const feed = `${server}/update/${process.platform}/${version}`;

autoUpdater.setFeedURL(feed);
// autoUpdater.checkForUpdates(); // check on launch

setInterval(() => {
	autoUpdater.checkForUpdates();
}, 60 * 1000);

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Restart', 'Later'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Restart the application to apply the updates.'
	};

	dialog.showMessageBox(dialogOpts, response => {
		if (response === 0) autoUpdater.quitAndInstall();
	});
});

autoUpdater.on('error', message => {
	console.error('There was a problem updating the application');
	console.error(message);
});

app.on('ready', () => {
	win = new BrowserWindow({width: 800, height: 600});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
});
