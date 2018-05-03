/* global describe, it */
const del = require('del');
const fs = require('mz/fs');
const extMiner = require('../lib/ext-miner');

describe('ext-miner', () => {
	describe('install()', () => {
		it('should run with no directory', async function () {
			this.timeout(100 * 1000);
			await extMiner.install();
		});

		it('should run when there exists an empty directory', async function () {
			this.timeout(100 * 1000);

			await del(extMiner.minerFolder, {force: true});
			await fs.mkdir(extMiner.minerFolder);

			await extMiner.install();
		});
	});

	describe('start()', () => {
		it('should start', async function () {
			this.timeout(10 * 1000);

			await extMiner.start('t1hASvMj8e6TXWryuB3L5TKXJB7XfNioZP3', 'CPU');
		});
	});

	describe('stop()', () => {
		it('should stop', async function () {
			this.timeout(10 * 1000);

			await extMiner.stop();
		});
	});
});
