/* global describe, it */
const assert = require('assert');
const Parser = require('../lib/parser');

describe('Parser', () => {
	it('should parse DSTM output', () => {
		const parser = new Parser();

		const expectedState = [
			{sols: 123.6, shares: 0},
			{sols: 115, shares: 0},
			{sols: 118.5, shares: 0},
			{sols: 118.5, shares: 1},
			{sols: 118.5, shares: 1}
		];

		parser.on('update', state => {
			assert.deepEqual(state, expectedState.shift());
		});

		`2018-05-02 12:03:19 PM|#  GPU0 + GeForce GTX 1050         MB: 2048  PCI: 2:0
2018-05-02 12:03:19 PM|
2018-05-02 12:03:19 PM|#  using configuration file zm.cfg
2018-05-02 12:03:19 PM|#  pool1 eu1-zcash.flypool.org:3333
2018-05-02 12:03:19 PM|#  pool2 ssl://eu1-zcash.flypool.org:3443
2018-05-02 12:03:19 PM|
2018-05-02 12:03:19 PM|#  telemetry server listening on 0.0.0.0:2222
2018-05-02 12:03:19 PM|#  connected to: eu1-zcash.flypool.org:3333 [1/2]
2018-05-02 12:03:22 PM|#  server set difficulty to: 0004189374bc6a7ef9db22d0...
2018-05-02 12:03:43 PM|>  GPU0  63C  Sol/s: 123.6  Sol/W: 3.96  Avg: 123.6  I/s: 65.4   Sh: 0.00   . .
2018-05-02 12:04:03 PM|   GPU0  67C  Sol/s: 115.0  Sol/W: 3.81  Avg: 119.3  I/s: 63.4   Sh: 0.00   . .
2018-05-02 12:04:23 PM|   GPU0  69C  Sol/s: 118.5  Sol/W: 3.80  Avg: 119.0  I/s: 63.2   Sh: 0.99   1.00 99  +
2018-05-02 12:04:43 PM|   GPU0  70C  Sol/s: 118.5  Sol/W: 3.79  Avg: 118.9  I/s: 63.3   Sh: 0.74   1.00 99`
			.split('\n')
			.forEach(line => parser.write(line));

		assert.equal(expectedState.length, 0);
	});

	it('should parse EWBF output', () => {
		const parser = new Parser();

		const expectedState = [
			{sols: 122, shares: 0},
			{sols: 122, shares: 0},
			{sols: 115, shares: 0},
			{sols: 115, shares: 0},
			{sols: 115, shares: 0},
			{sols: 115, shares: 0},
			{sols: 113, shares: 0},
			{sols: 113, shares: 0},
			{sols: 113, shares: 1},
			{sols: 113, shares: 2}
		];

		parser.on('update', state => {
			assert.deepEqual(state, expectedState.shift());
		});

		`+-------------------------------------------------+
|         EWBF's Zcash CUDA miner. 0.3.4b         |
+-------------------------------------------------+
INFO: Current pool: zec-eu1.nanopool.org:6666
INFO: Selected pools: 1
INFO: Solver: Auto.
INFO: Devices: All.
INFO: Temperature limit: 90
INFO: Api: Disabled
---------------------------------------------------
INFO: Target: 00028f5c00000000...
INFO: Detected new work: 1524833398
CUDA: Device: 0 GeForce GTX 1050, 2048 MB i:64
CUDA: Device: 0 Selected solver: 0
Temp: GPU0: 69C
GPU0: 122 Sol/s
Total speed: 122 Sol/s
INFO: Detected new work: 1524833399
Temp: GPU0: 72C
GPU0: 115 Sol/s
Total speed: 115 Sol/s
Temp: GPU0: 73C
GPU0: 115 Sol/s
Total speed: 115 Sol/s
INFO: Detected new work: 1524833400
Temp: GPU0: 74C
GPU0: 113 Sol/s
Total speed: 113 Sol/s
INFO 12:57:03: GPU0 Accepted share
INFO 12:57:07: GPU0 Accepted share`
			.split('\n')
			.forEach(line => parser.write(line));

		assert.equal(expectedState.length, 0);
	});
});
