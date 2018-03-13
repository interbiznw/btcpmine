/* eslint curly: ["error", "multi"] */

module.exports = {
	win32: {
		url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Windows_x64_nheqminer-5c.zip',
		binary: 'Windows_x64_nheqminer-5c/nheqminer.exe',
		arguments: address => ['-l', 'zec-us-east1.nanopool.org:6666', '-u',
			`t1YtcRXgoDsVj6sDhGA71sgdDLoR9Q1QcnL/${address}`, '-cd', '0', '-p', 'x'],
		parse: line => {
			const parts = line.split(' ');
			if (parts[parts.length - 1].startsWith('Sols/s'))
				return {sols: Number(parts[parts.length - 2])};
		}
	}
};

// [10:55:16][0x00006040] Speed [15 sec]: 47.4667 I/s, 91.8667 Sols/s
