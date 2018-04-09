const url = require('url');
const path = require('path');
const {app, BrowserWindow} = require('electron');

let win;

app.on('ready', () => {
	win = new BrowserWindow({width: 800, height: 800});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
});
