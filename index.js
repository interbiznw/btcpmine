const url = require('url');
const path = require('path');
const {app, BrowserWindow} = require('electron');

let win;

const updater = require('electron-simple-updater');

updater.init('https://raw.githubusercontent.com/super3/zmine/master/updates.json');

app.on('ready', () => {
	win = new BrowserWindow({width: 800, height: 600});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
});
