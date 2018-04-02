/* global describe, it */
const extMiner = require('../lib/ext-miner');

describe('ext-miner', () => {
	describe('install()', () => {
		it('should run without fail', async function () {
			this.timeout(10 * 1000);
			await extMiner.install();
		});
	});

	describe('start()', () => {
		it('should start', async () => {
			await extMiner.start('t1hASvMj8e6TXWryuB3L5TKXJB7XfNioZP3', 'CPU');
		});
	});

	describe('stop()', () => {
		it('should stop', async () => {
			await extMiner.stop();
		});
	});
});
