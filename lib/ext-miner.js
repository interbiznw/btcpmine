const path = require('path');
const os = require('os');
const util = require('util');
const {spawn} = require('child_process');
const got = require('got');
const extract = util.promisify(require('extract-zip'));
const fs = require('mz/fs');
const Parser = require('./parser');
const miners = require('./../miners');

// detect if platform and arch supported, else return false
/* istanbul ignore next */
const minerInfo =
	typeof miners[process.platform] === 'object' &&
	typeof miners[process.platform][process.arch] === 'object' ?
		miners[process.platform][process.arch] : false;

console.log(minerInfo);

/* istanbul ignore next */
if (minerInfo === false)
	console.warn(`Platform ${process.platform}/${process.arch} unsupported!`);

const minerFolder = path.join(os.homedir(), '/.zmine');
const zipPath = path.join(minerFolder, 'miner.zip');
const minerPath = path.join(minerFolder, minerInfo.binary);

let miner;

module.exports = {
	supported: minerInfo !== false,
	minerFolder,
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

		// when done downloading, unzip
		/* istanbul ignore next */
		await new Promise(resolve => {
			// download zip and save to file
			// not sure why coverage fails for these lines
			/* istanbul ignore next */
			const zipStream = fs.createWriteStream(zipPath);
			/* istanbul ignore next */
			got.stream(minerInfo.url).pipe(zipStream);

			/* istanbul ignore next */
			zipStream.on('close', resolve);
		});

		await extract(zipPath, {dir: minerFolder});
		await fs.unlink(zipPath);

		/* istanbul ignore next */
		if (process.platform !== 'win32')
			// make executable for owner
			await fs.chmod(minerPath, fs.constants.S_IXUSR);

		return true;
	},
	async start(address, mode, cores) {
		miner = spawn(minerPath,
			minerInfo.arguments(address, mode, cores));

		const parser = new Parser();

		await new Promise((resolve, reject) => {
			let responded = false;

			function handleOutput(data) {
				console.log(data);
				if (responded === false) {
					// assume output means process started
					resolve();
					responded = true;
				}

				parser.write(data.toString());
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

		return parser;
	},
	async stop() {
		miner.kill('SIGINT');

		await new Promise(resolve => {
			resolve();
			// miner.on('exit', resolve);
		});
	}
};
