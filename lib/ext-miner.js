const path = require('path');
const crypto = require('crypto');
const os = require('os');
const util = require('util');
const {spawn} = require('child_process');
const got = require('got');
const extract = util.promisify(require('extract-zip'));
const fs = require('mz/fs');
const Parser = require('./parser');
const miners = require('./../miners');

class ExtMiner {
	constructor() {
		this.availableMiners = miners
			.filter(miner => `${process.platform}_${process.arch}` in miner.platform)
			.map(miner => Object.assign(miner, miner.platform[`${process.platform}_${process.arch}`]));

		this.miners = this.availableMiners.map(miner => miner.title);

		// detect if platform and arch supported
		this.supported = this.availableMiners.length !== 0;

		/* istanbul ignore next */
		if (this.supported === false)
			console.warn(`Platform ${process.platform}/${process.arch} unsupported!`);

		this.minerFolder = path.join(os.homedir(), '/.btcpmine');
	}

	async install() {
		// check if ~/.zmine exists, creating it if needed
		try {
			await fs.stat(this.minerFolder);
		} catch (err) {
			await fs.mkdir(this.minerFolder);
		}

		const urls = [
			...new Set(
				Object.values(this.availableMiners).map(miner => miner.url)
			)
		];

		await Promise.all(urls.map(async url => {
			// check if miner exists
			const hash = crypto.createHash('sha256');
			hash.update(url);

			const id = 'miner-' + hash.digest('hex');

			const folderPath = path.join(this.minerFolder, id);
			const zipPath = path.join(this.minerFolder, `${id}.zip`);

			this.availableMiners
				.filter(miner => miner.url === url)
				.forEach(miner => {
					miner.folderPath = folderPath;
				});

			if (await fs.exists(folderPath))
				return;

			// when done downloading, unzip
			/* istanbul ignore next */
			await new Promise(resolve => {
				// download zip and save to file
				// not sure why coverage fails for these lines
				/* istanbul ignore next */
				const zipStream = fs.createWriteStream(zipPath);
				/* istanbul ignore next */
				got.stream(url).pipe(zipStream);

				/* istanbul ignore next */
				zipStream.on('close', resolve);
			});

			await extract(zipPath, {
				dir: folderPath
			});

			await fs.unlink(zipPath);
		}));

		return true;
	}

	async start(address, minerTitle, cores) {
		const minerInfo = this.availableMiners.find(miner => miner.title === minerTitle);
		const minerPath = path.join(minerInfo.folderPath, minerInfo.binary);

		/* istanbul ignore next */
		if (process.platform !== 'win32')
			// make executable for owner
			await fs.chmod(minerPath, fs.constants.S_IXUSR);

		this.miner = spawn(minerPath,
			minerInfo.arguments(address, cores));

		const parser = new Parser();

		new Promise((resolve, reject) => {
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
			this.miner.on('error', err => {
				/* istanbul ignore next */

				if (responded === false) {
					reject(err);
					responded = true;
				}
			});

			this.miner.stdout.on('data', handleOutput);
			this.miner.stderr.on('data', handleOutput);
		});

		return parser;
	}

	async stop() {
		this.miner.kill('SIGINT');
	}
}

module.exports = new ExtMiner();
