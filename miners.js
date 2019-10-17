/* eslint camelcase: "off" */

const gminerArguments = address => {
	return [
		'--algo',
		'192_7',
		'--pers',
		'BTCP_PoW',
		'--server',
		'pool.btcprivate.org',
		'--port',
		'2053',
		'-user',
		`${address}`,
		'-pass',
		'x'
	];
};

const lolMinerArguments = address => {
	return [
		'--coin',
		'AUTO192_7',
		'--overwritePersonal',
		'BTCP_PoW',
		'--pool',
		'pool.btcprivate.org',
		'--port',
		'2053',
		'--user',
		`${address}`,
		'--pass',
		'x'
	];
};

const ewbfArguments = address => {
	return [
		'--algo',
		'192_7',
		'--pers',
		'BTCP_PoW',
		'--server',
		'pool.btcprivate.org',
		'--port',
		'2053',
		'--user',
		`${address}`,
		'--pass',
		'x'
	];
};

const miniZArguments = address => {
	return [
		'--par',
		'192_7',
		'--pers',
		'BTCP_PoW',
		'--server',
		'pool.btcprivate.org',
		'--port=',
		'2053',
		'--user',
		`${address}`,
		'--pass',
		'x'
	];
};
const gminerPlatforms = {
	win32_x64: {
		url: 'https://github.com/develsoftware/GMinerRelease/releases/download/1.70/gminer_1_70_windows64.zip',
		binary: 'miner.exe'
	},
	linux_x64: {
		url: 'https://github.com/develsoftware/GMinerRelease/releases/download/1.70/gminer_1_70_linux64.tar.gz',
		binary: 'miner'
	}
};

const lolMinerPlatforms = {
	win32_x64: {
		url: 'https://github.com/Lolliedieb/lolMiner-releases/releases/download/0.8.8/lolMiner_v088_Win64.zip',
		binary: 'lolMiner.exe'
	},
	linux_x64: {
		url: 'https://github.com/Lolliedieb/lolMiner-releases/releases/download/0.8.8/lolMiner_v088_Lin64.tar.gz',
		binary: 'lolMiner'
	}
};

const ewbfPlatforms = {
	win32_x64: {
		url: 'https://btcpcommunity.com/ewbf-0_6.zip',
		binary: 'miner.exe'
	}
};

const miniZPlatforms = {
	win32_x64: {
		url: 'https://miniz.ch/?smd_process_download=1&download_id=3109',
		binary: 'miniZ.exe'
	},
	linux_x64: {
		url: 'https://miniz.ch/?smd_process_download=1&download_id=3111',
		binary: 'miniZ'
	}
};

module.exports = [
	{
		title: 'Gminer 1.70',
		minerMode: 'NVIDIA & AMD GPU',
		arguments: (address, cores) => [...gminerArguments(address), '--cuda_devices', Object.keys([...new Array(cores)]).join(' ')],
		platform: gminerPlatforms
	},
	{
		title: 'lolMiner v0.8.8',
		minerMode: 'NVIDIA & AMD GPU',
		arguments: address => [...lolMinerArguments(address), '--devices', Object.keys([...new Array(cores)]).join(' ')],
		platform: lolMinerPlatforms
	},
	{
		title: 'EWBF-0.6',
		minerMode: 'NVIDIA GPU',
		arguments: (address, cores) => [...ewbfArguments(address), '--cuda_devices', Object.keys([...new Array(cores)]).join(' ')],
		platform: ewbfPlatforms
	},
	{
		title: 'miniZ v1.5',
		minerMode: 'NVIDIA GPU',
		arguments: address => [...miniZArguments(address), '--cuda-devices', Object.keys([...new Array(cores)]).join(' ')],
		platform: miniZPlatforms
	}
	// {
	// 	title: 'Claymore-12.6 - AMD GPU',
	// 	arguments: address => [
	// 		'-zpool',
	// 		'ssl://us1-zcash.flypool.org:3443',
	// 		'-zwal',
	// 		address,
	// 		'-zpsw',
	// 		'z'
	// 	],
	// 	platform: {
	// 		win32_x64: {
	// 			url: 'https://github.com/nanopool/ClaymoreZECMiner/releases/download/v12.6/Claymore.s.ZCash.AMD.GPU.Miner.v12.6.zip',
	// 			binary: 'ZecMiner64.exe'
	// 		}
	// 	}
	// }

];

// console.log(module.exports[4].arguments);
