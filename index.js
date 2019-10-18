const url = require('url');
const path = require('path');
const {app, BrowserWindow} = require('electron');

let win;

app.on('ready', () => {
	win = new BrowserWindow({width: 900,
		height: 865,
		resizable: false,
		icon: path.join(__dirname, 'assets/icons/png/64x64.png')

	});
	win.setMenu(null);
		//win.openDevTools({detached: true});
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
});
