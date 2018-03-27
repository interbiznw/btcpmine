/* eslint capitalized-comments: ["error", "never"] */

const path = require('path');
const util = require('util');
const {spawn} = require('child_process');
const got = require('got');
const extract = util.promisify(require('extract-zip'));
const fs = require('mz/fs');
const miners = require('./../miners.js');

const minerInfo = miners[process.platform];
const minerFolder = path.join(__dirname, '/../miner');
const zipPath = path.join(__dirname, '/../miner.zip');

let minerOutput = {
	sols: 0,
	shares: 0
};

let miner;

module.exports = {
	async install() {
		// check if miner exists
		const minerPath = path.join(__dirname, '/../miner/', minerInfo.binary);
		if (await fs.exists(minerPath)) {
			return true;
		}

		// download zip and save to file
		const zipStream = fs.createWriteStream(zipPath);
		got.stream(minerInfo.url).pipe(zipStream);

		// when done downloading, unzip
		await new Promise(resolve => {
			zipStream.on('close', async () => {
				await extract(zipPath, {dir: minerFolder});
				await fs.unlink(zipPath);

				resolve(true);
			});
		});
	},
	async start(address, mode, callback) {
		const minerPath = path.join(__dirname, '/../miner/',
			minerInfo.binary);

		miner = spawn(minerPath,
			minerInfo.arguments(address, mode));

		function handleOutput(data) {
			minerInfo.parse(minerOutput, data.toString());
			callback(minerOutput, data);
		}

		miner.stdout.on('data', handleOutput);
		miner.stderr.on('data', handleOutput);
	},
	async stop() {
		miner.kill('SIGINT');

		minerOutput = {
			sols: 0,
			shares: 0
		};
	}
};
