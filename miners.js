const nheqminer = {
	arguments: (address, mode, cores) => {
		let coreList = '0';
		for (let i = 1; i < cores; i++) {
			/* istanbul ignore next */
			coreList += ` ${i}`;
		}

		const modes = {
			CPU: ['-t', cores],
			NVIDIA: ['-cd', coreList],
			AMD: ['-od', coreList]
		};

		return [
			'-l', 'us1-zcash.flypool.org:3333',
			'-u',
			address,
			'-p',
			'x',
			...modes[mode]
		];
	}
};

const dstm = {
	// zm --server eu1-zcash.flypool.org  --port 3333 --user t1Ja3TR6QBRDUd897sLn1YSeKc8HnWmvHbu
	arguments: (address, mode, cores) => {
		console.log(cores);
		return [
			'--server', 'us1-zcash.flypool.org',
			'--port',	`3333`,
			'--user', address
		];
	}
};

//

module.exports = {
	win32: {
		x64: {/*
			url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Windows_x64_nheqminer-5c.zip',
			binary: 'Windows_x64_nheqminer-5c/nheqminer.exe',
			arguments: nheqminer.arguments,
			parse: nheqminer.parse
		*/
			url: 'https://github.com/nemosminer/DSTM-equihash-miner/releases/download/DSTM-0.6/zm_0.6_win.zip',
			binary: 'zm_0.6_win/zm.exe',
			arguments: dstm.arguments,
			parse: dstm.parse
		}
	},
	linux: {
		x64: {
			url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Ubuntu_16_04_x64_cuda_djezo_avx_nheqminer-5c.zip',
			binary: 'nheqminer_16_04',
			arguments: nheqminer.arguments,
			parse: nheqminer.parse
		}
	}
};

// [10:55:16][0x00006040] Speed [15 sec]: 47.4667 I/s, 91.8667 Sols/s
// [11:42:01][0x000033f0] stratum | Accepted share #4
