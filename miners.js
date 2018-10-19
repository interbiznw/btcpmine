/* eslint camelcase: "off" */

const nheqminerArguments = address => {
	return [
		'-l', 'pool.btcprivate.org:2053',
		'-u',
		`${address}`,
		'-p',
		'x'
	];
};

const dstmArguments = address => {
	return [
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

const ewbfArguments = address => {
	return [
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

const claymoreArguments = address => {
	return [
		'-zpool',
		'pool.btcprivate.org:2053',
		'-zwal',
		`${address}`,
		'-zpsw',
		'x'
	];
};

const nheqminerPlatforms = {
	win32_x64: {
		url: 'https://github.com/interbiznw/nheqminer/releases/download/0.5-c_equi_cpu/nheqminer-0.5c-equi-cpu.zip',
		binary: 'nheqminer.exe'
	},
	linux_x64: {
		url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Ubuntu_16_04_x64_cuda_djezo_avx_nheqminer-5c.zip',
		binary: 'nheqminer_16_04'
	}
};

const dstmPlatforms = {
	win32_x64: {
		url: 'https://github.com/nemosminer/DSTM-equihash-miner/releases/download/DSTM-0.6/zm_0.6_win.zip',
		binary: 'zm_0.6_win/zm.exe'
	}
};

const ewbfPlatforms = {
	win32_x64: {
		url: 'https://github.com/nanopool/ewbf-miner/releases/download/v0.3.4b/Zec.miner.0.3.4b.zip',
		binary: 'miner.exe'
	}
};

const claymorePlatforms = {
	win32_x64: {
		url: 'https://github.com/nanopool/ClaymoreZECMiner/releases/download/v12.6/Claymore.s.ZCash.AMD.GPU.Miner.v12.6.zip',
		binary: 'ZecMiner64.exe'
	},
	linux_x64: {
		url: 'https://github.com/nanopool/ClaymoreZECMiner/releases/download/v12.6/Claymore.s.ZCash.AMD.GPU.Miner.v12.6.-.LINUX.tar.gz',
		binary: 'zecminer64'
	}
};

module.exports = [
	{
		title: 'NiceHash v0.5c - CPU',
		arguments: (address, cores) => [...nheqminerArguments(address), '-t', cores],
		platform: nheqminerPlatforms
	},
	{
		title: 'NiceHash v0.5c - NVIDIA GPU',
		arguments: (address, cores) => [...nheqminerArguments(address), '-cd', Object.keys([...new Array(cores)]).join(' ')],
		platform: nheqminerPlatforms
	},
	{
		title: 'Claymore Miner - AMD GPU',
		arguments: (address, cores) => [...claymoreArguments(address), '-nofee', '1', '-allpools', '1'],
		platform: claymorePlatforms
	},
	{
		title: 'DSTM-0.6 - NVIDIA GPU',
		arguments: (address, cores) => [...dstmArguments(address), '--dev', Object.keys([...new Array(cores)]).join(' ')],
		platform: dstmPlatforms
	},
	{
		title: 'EWBF-0.3.4b - NVIDIA GPU',
		arguments: (address, cores) => [...ewbfArguments(address), '--cuda_devices', Object.keys([...new Array(cores)]).join(' ')],
		platform: ewbfPlatforms
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

console.log(module.exports[3].arguments);
