/* eslint camelcase: "off" */

const nheqminerArguments = address => {
	return [
		'-l', 'us1-zcash.flypool.org:3333',
		'-u',
		address,
		'-p',
		'x'
	];
};

const dstmArguments = {
	// zm --server eu1-zcash.flypool.org  --port 3333 --user t1Ja3TR6QBRDUd897sLn1YSeKc8HnWmvHbu
	arguments: (address, mode, cores) => {
		return [
			'--server', 'us1-zcash.flypool.org',
			'--port',	`3333`,
			'--user', address
		];
	}
};

module.exports = [
	{
		title: 'NiceHash v0.5c - CPU',
		arguments: (address, cores) => [...nheqminerArguments(address), '-t', cores],
		platform: {
			win32_x64: {
				url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Windows_x64_nheqminer-5c.zip',
				binary: 'Windows_x64_nheqminer-5c/nheqminer.exe'
			}
		}
	},
	{
		title: 'NiceHash v0.5c - NVIDIA GPU',
		arguments: (address, cores) => [...nheqminerArguments(address), '-cd', Object.keys(Array.from(new Array(cores))).join(' ')],
		platform: {
			win32_x64: {
				url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Windows_x64_nheqminer-5c.zip',
				binary: 'Windows_x64_nheqminer-5c/nheqminer.exe'
			}
		}
	},
	{
		title: 'NiceHash v0.5c - AMD GPU',
		arguments: (address, cores) => [...nheqminerArguments(address), '-od', Object.keys(Array.from(new Array(cores))).join(' ')],
		platform: {
			win32_x64: {
				url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Windows_x64_nheqminer-5c.zip',
				binary: 'Windows_x64_nheqminer-5c/nheqminer.exe'
			}
		}
	},
	{
		title: 'DSTM-0.6 - NVIDIA GPU',
		arguments: address => [
			'--server',
			'us1-zcash.flypool.org',
			'--port',
			'3333',
			'--user',
			address
		],
		platform: {
			win32_x64: {
				url: 'https://github.com/nemosminer/DSTM-equihash-miner/releases/download/DSTM-0.6/zm_0.6_win.zip',
				binary: 'zm_0.6_win/zm.exe'
			}
		}
	}
	// {
	// 	title: 'EWBF-0.3.4b - NVIDIA GPU',
	// 	arguments: address => [
	// 		'--server',
	// 		'us1-zcash.flypool.org',
	// 		'--port',
	// 		'3333',
	// 		'--user',
	// 		address
	// 	],
	// 	platform: {
	// 		win32_x64: {
	// 			url: 'https://github.com/nanopool/ewbf-miner/releases/download/v0.3.4b/Zec.miner.0.3.4b.zip',
	// 			binary: 'miner.exe'
	// 		}
	// 	}
	// }
];
