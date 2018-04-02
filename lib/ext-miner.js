const path = require('path');
const os = require('os');
const util = require('util');
const {spawn} = require('child_process');
const got = require('got');
const extract = util.promisify(require('extract-zip'));
const fs = require('mz/fs');
const miners = require('./../miners.js');

// detect if platform and arch supported, else return false
const minerInfo =
	typeof miners[process.platform] === 'object' &&
	typeof miners[process.platform][process.arch] === 'object' ?
		miners[process.platform][process.arch] : false;

const minerFolder = path.join(os.homedir(), '/.zmine');
const zipPath = path.join(minerFolder, 'miner.zip');
const minerPath = path.join(minerFolder, minerInfo.binary);

let minerOutput = {
	sols: 0,
	shares: 0
};

let miner;

module.exports = {
	supported: minerInfo !== false,
	async install() {
		// check if ~/.zmine exists, creating it if needed
		try {
			await fs.stat(minerFolder);
		} catch (err) {
			await fs.mkdir(minerFolder);
		}

		// check if miner exists
		const minerPath = path.join(minerFolder, minerInfo.binary);
		if (await fs.exists(minerPath)) {
			return true;
		}

		// download zip and save to file
		const zipStream = fs.createWriteStream(zipPath);
		got.stream(minerInfo.url).pipe(zipStream);

		// when done downloading, unzip
		await new Promise(resolve => {
			zipStream.on('close', resolve);
		});

		await extract(zipPath, {dir: minerFolder});
		await fs.unlink(zipPath);

		// make executable for owner
		await fs.chmod(minerPath, fs.constants.S_IXUSR);

		return true;
	},
	async start(address, mode, callback = () => {}) {
		miner = spawn(minerPath,
			minerInfo.arguments(address, mode));

		await new Promise((resolve, reject) => {
			let responded = false;

			function handleOutput(data) {
				if (responded === false) {
					// assume output means process started
					resolve();
					responded = true;
				}

				minerInfo.parse(minerOutput, data.toString());
				callback(minerOutput, data);
			}

			// reject on process error
			miner.on('error', err => {
				if (responded === false) {
					reject(err);
					responded = true;
				}
			});

			miner.stdout.on('data', handleOutput);
			miner.stderr.on('data', handleOutput);
		});
	},
	async stop() {
		miner.kill('SIGINT');

		minerOutput = {
			sols: 0,
			shares: 0
		};

		await new Promise(resolve => {
			miner.on('exit', resolve);
		});
	}
};
