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
			`${address}`,
			'-p',
			'x',
			...modes[mode]
		];
	},
	parse: (minerOutput, line) => {
		const parts = line.split(' ');

		/* istanbul ignore next */
		if (parts.length > 7 && parts[7].startsWith('Sols/s'))
			minerOutput.sols = Number(parts[6]);

		/* istanbul ignore next */
		if (parts.length > 4 && parts[3] === 'Accepted' && parts[4] === 'share')
			minerOutput.shares++;
	}
};

module.exports = {
	win32: {
		x64: {
			url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Windows_x64_nheqminer-5c.zip',
			binary: 'Windows_x64_nheqminer-5c/nheqminer.exe',
			arguments: nheqminer.arguments,
			parse: nheqminer.parse
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
