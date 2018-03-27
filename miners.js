/* eslint curly: ["error", "multi"] */

const nheqminer = {
	arguments: (address, mode) => {
		const args = [
			'-l', 'us1-zcash.flypool.org:3333',
			'-u',
			`${address}`,
			'-p',
			'x'
		];

		const modes = {
			CPU: ['-t', '4'],
			NVIDIA: ['-cd', '0'],
			AMD: ['-od', '0']
		};

		args.push(...modes[mode]);
		return args;
	},
	parse: (minerOutput, line) => {
		const parts = line.split(' ');

		if (parts.length > 7 && parts[7].startsWith('Sols/s'))
			minerOutput.sols = Number(parts[6]);
		if (parts.length > 4 && parts[3] === 'Accepted' && parts[4] === 'share')
			minerOutput.shares++;
	}
};

module.exports = {
	win32: {
		url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Windows_x64_nheqminer-5c.zip',
		binary: 'Windows_x64_nheqminer-5c/nheqminer.exe',
		arguments: nheqminer.arguments,
		parse: nheqminer.parse
	},
	linux: {
		url: 'https://github.com/nicehash/nheqminer/releases/download/0.5c/Ubuntu_16_04_x64_cuda_djezo_avx_nheqminer-5c.zip',
		binary: 'nheqminer_16_04',
		arguments: nheqminer.arguments,
		parse: nheqminer.parse
	}
};

// [10:55:16][0x00006040] Speed [15 sec]: 47.4667 I/s, 91.8667 Sols/s
// [11:42:01][0x000033f0] stratum | Accepted share #4
