/* global describe, it */
const extMiner = require('../lib/ext-miner');

describe('ext-miner', () => {
	describe('install()', () => {
		it('should run without fail', async () => {
			await extMiner.install();
		});
	});
});
