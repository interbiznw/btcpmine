module.exports = {
	win32: {
		url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Windows_x64_nheqminer-5c.zip',
		binary: 'Windows_x64_nheqminer-5c/nheqminer.exe',
		arguments: address => ['-l', 'zec-us-east1.nanopool.org:6666', '-u',
			`t1YtcRXgoDsVj6sDhGA71sgdDLoR9Q1QcnL/${address}`, '-cd', '0', '-p', 'x']
	}
};
