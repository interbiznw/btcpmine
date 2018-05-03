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

const availableMiners = miners
	.filter(miner => `${process.platform}_${process.arch}` in miner.platform)
	.map(miner => Object.assign(miner, miner.platform[`${process.platform}_${process.arch}`]));

/* istanbul ignore next */
if (availableMiners.length === 0)
	console.warn(`Platform ${process.platform}/${process.arch} unsupported!`);

const minerFolder = path.join(os.homedir(), '/.zmine');
const zipPath = path.join(minerFolder, 'miner.zip'); // mutlple miners?

let miner;

module.exports = {
	supported: availableMiners.length > 0,
	minerFolder,
	miners: availableMiners.map(miner => miner.title),
	async install() {
		// check if ~/.zmine exists, creating it if needed
		try {
			await fs.stat(minerFolder);
		} catch (err) {
			await fs.mkdir(minerFolder);
		}

		for (const minerInfo of availableMiners) {
			// check if miner exists
			const minerPath = path.join(minerFolder, minerInfo.binary);

			if (await fs.exists(minerPath)) {
				continue;
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
		}

		return true;
	},
	async start(address, minerTitle, cores) {
		const minerInfo = availableMiners.find(miner => miner.title === minerTitle);
		const minerPath = path.join(minerFolder, minerInfo.binary);

		miner = spawn(minerPath,
			minerInfo.arguments(address, cores));

		const parser = new Parser();

		await new Promise((resolve, reject) => {
			let responded = false;

			function handleOutput(data) {
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
