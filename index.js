const url = require('url');
const path = require('path');
const {app, BrowserWindow} = require('electron');

let win;

const {autoUpdater} = require('electron-updater');
const {version} = require('./package.json');

const server = 'http://zfaucet.org:3005';
const feed = `${server}/update/${process.platform}/${version}`;

autoUpdater.setFeedURL(feed);

app.on('ready', () => {
	win = new BrowserWindow({width: 800, height: 600});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
});
