const url = require('url');
const path = require('path');
const {app, BrowserWindow} = require('electron');

let win;

const updater = require('electron-simple-updater');

updater.init('https://gist.githubusercontent.com/super3/35a9d706b9f70ef236eb04d472431cf5/raw/13bac8aace03e8bc1859ddb3b8cea2882d1d5a38/updates.json');

app.on('ready', () => {
	win = new BrowserWindow({width: 800, height: 600});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
});
