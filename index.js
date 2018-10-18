const url = require('url');
const path = require('path');
const {app, BrowserWindow} = require('electron');

let win;

app.on('ready', () => {
	win = new BrowserWindow({width: 900, height: 800});
	win.setMenu(null);

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
});
