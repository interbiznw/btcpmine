/* eslint camelcase: "off" */
const lolMinerArguments = (address, cores, worker) => {
	return [
		'--coin',
		'AUTO192_7',
		'--overwritePersonal',
		'BTCP_PoW',
		'--pool',
		'pool.btcp.network',
		'--port',
		'3032',
		'--user',
		`${3LHEJozXt3xhKuuwPmWTpuEciXYGfQhQP8.${worker}`,
		'--pass',
		'x'
	];
};

const ewbfArguments = (address, cores, worker) => {
	return [
		'--algo',
		'192_7',
		'--pers',
		'BTCP_PoW',
		'--server',
		'pool.btcp.network',
		'--port',
		'3032',
		'--user',
		`${3LHEJozXt3xhKuuwPmWTpuEciXYGfQhQP8.${worker}`,
		'--pass',
		'x'
	];
};

const miniZArguments = (address, cores, worker) => {
	return [
		'--par=192,7',
		'--pers=BTCP_PoW',
		'--server=pool.btcp.network',
		'--port=3032',
		`--user=${3LHEJozXt3xhKuuwPmWTpuEciXYGfQhQP8}.${worker}`,
		'--pass=x'
	];
};

const lolMinerPlatforms = {
	win32_x64: {
		url: 'https://github.com/Lolliedieb/lolMiner-releases/releases/download/0.8.8/lolMiner_v088_Win64.zip',
		binary: '0.8.8\\lolMiner.exe'
	},
	linux_x64: {
		url: 'https://github.com/Lolliedieb/lolMiner-releases/releases/download/0.8.8/lolMiner_v088_Lin64.tar.gz',
		binary: 'lolMiner'
	}
};

const ewbfPlatforms = {
	win32_x64: {
		url: 'https://github.com/interbiznw/ewbf-0.6/releases/download/0.6/EWBF.Equihash.miner.v0.6.zip',
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
		title: 'lolMiner v0.8.8',
		minerMode: 'NVIDIA & AMD GPU',
		arguments: (address, cores, worker) => [...lolMinerArguments(address, cores, worker)],
		platform: lolMinerPlatforms
	},
	{
		title: 'EWBF-0.6',
		minerMode: 'NVIDIA GPU',
		arguments: (address, cores, worker) => [...ewbfArguments(address, cores, worker)],
		platform: ewbfPlatforms
	},
	{
		title: 'miniZ v1.5',
		minerMode: 'NVIDIA GPU',
		arguments: (address, cores, worker) => [...miniZArguments(address, cores, worker)],
		platform: miniZPlatforms
	}

	// {
	// 	title: 'Claymore-12.6 - AMD GPU',
	// 	arguments: address => [
	// 		'-zpool',
	// 		'ssl://us1-zcash.flypool.org:3443',
	// 		'-zwal',
	// 		'3LHEJozXt3xhKuuwPmWTpuEciXYGfQhQP8',
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
