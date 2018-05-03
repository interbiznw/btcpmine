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

	it('should parse Nheqminer output', () => {
		const parser = new Parser();

		const expectedState = [
			{sols: 67.99, shares: 0},
			{sols: 88.07, shares: 0},
			{sols: 85.00, shares: 0},
			{sols: 82.07, shares: 0},
			{sols: 92.33, shares: 0},
			{sols: 88.00, shares: 0},
			{sols: 87.60, shares: 0},
			{sols: 87.20, shares: 0},
			{sols: 89.73, shares: 0},
			{sols: 89.67, shares: 0},
			{sols: 90.07, shares: 0},
			{sols: 87.87, shares: 0},
			{sols: 87.53, shares: 0},
			{sols: 87.87, shares: 0},
			{sols: 82.40, shares: 0},
			{sols: 86.27, shares: 0},
			{sols: 85.47, shares: 0},
			{sols: 91.73, shares: 0},
			{sols: 91.73, shares: 1}
		];

		parser.on('update', state => {
			assert.deepEqual(state, expectedState.shift());
		});

		`==================== www.nicehash.com ====================
	Equihash CPU&GPU Miner for NiceHash v0.5c
Thanks to Zcash developers for providing base of the code.
	Special thanks to tromp, xenoncat and djeZo for providing
	  optimized CPU and CUDA equihash solvers.
==================== www.nicehash.com ====================

[08:02:38][0x00000b5c] Using SSE2: YES
[08:02:38][0x00000b5c] Using AVX: YES
[08:02:38][0x00000b5c] Using AVX2: YES
Setting log level to 2
[08:02:39][0x00001fd4] stratum | Starting miner
[08:02:39][0x00001e0c] miner#0 | Starting thread #0 (CUDA-DJEZO) GeForce GTX 1050 (#0) M=1
[08:02:39][0x00001fd4] stratum | Connecting to stratum server us1-zcash.flypool.org:3333
[08:02:39][0x00001fd4] stratum | Connected!
[08:02:39][0x00001fd4] stratum | Subscribed to stratum server
[08:02:39][0x00001fd4] miner | Extranonce is 10683b7f5a
[08:02:39][0x00001fd4] stratum | Authorized worker t1VL5sKSgU5pQ1kqMadBpx3gwHxxkX1PMJi
[08:02:39][0x00001fd4] stratum | Target set to 0004189374bc6a7ef9db22d0e5604189374bc6a7ef9db22d0e5604189374bc6a
[08:02:40][0x00001fd4] stratum | Received new job #34602b044822ae01daa2
[08:02:49][0x00000b5c] Speed [15 sec]: 37.7947 I/s, 67.9914 Sols/s
[08:02:59][0x00000b5c] Speed [15 sec]: 47.6 I/s, 88.0667 Sols/s
[08:03:07][0x00001fd4] stratum | Received new job #0ca75618f9ed0a72b6b0
[08:03:10][0x00000b5c] Speed [15 sec]: 44.2667 I/s, 85 Sols/s
[08:03:20][0x00000b5c] Speed [15 sec]: 44.2667 I/s, 82.0667 Sols/s
[08:03:30][0x00000b5c] Speed [15 sec]: 47.3333 I/s, 92.3333 Sols/s
[08:03:41][0x00000b5c] Speed [15 sec]: 47.4 I/s, 88 Sols/s
[08:03:51][0x00000b5c] Speed [15 sec]: 47.4 I/s, 87.6 Sols/s
[08:04:01][0x00000b5c] Speed [15 sec]: 47.4 I/s, 87.2 Sols/s
[08:04:11][0x00000b5c] Speed [15 sec]: 47.5333 I/s, 89.7333 Sols/s
[08:04:22][0x00000b5c] Speed [15 sec]: 47.6 I/s, 89.6667 Sols/s
[08:04:32][0x00000b5c] Speed [15 sec]: 47.6667 I/s, 90.0667 Sols/s
[08:04:42][0x00000b5c] Speed [15 sec]: 47.5333 I/s, 87.8667 Sols/s
[08:04:53][0x00000b5c] Speed [15 sec]: 47.4 I/s, 87.5333 Sols/s
[08:05:03][0x00000b5c] Speed [15 sec]: 47.5333 I/s, 87.8667 Sols/s
[08:05:13][0x00000b5c] Speed [15 sec]: 47.5333 I/s, 82.4 Sols/s
[08:05:23][0x00000b5c] Speed [15 sec]: 47.5333 I/s, 86.2667 Sols/s
[08:05:34][0x00000b5c] Speed [15 sec]: 47.5333 I/s, 85.4667 Sols/s
[08:11:24][0x00000b5c] Speed [15 sec]: 47.6 I/s, 91.7333 Sols/s
[08:11:28][0x00001e0c] stratum | Submitting share #4, nonce 000000000000000000000000000000000000000000000000000a83
[08:11:28][0x00001fd4] stratum | Accepted share #4`
			.split('\n')
			.forEach(line => parser.write(line));

		assert.equal(expectedState.length, 0);
	});
});
