/* global localStorage */
/* eslint curly: ["error", "multi"] */
/* eslint capitalized-comments: ["error", "never"] */

const path = require('path');
const util = require('util');
const {spawn} = require('child_process');
const {shell} = require('electron');
const base58check = require('base58check');
const got = require('got');
const extract = util.promisify(require('extract-zip'));
const Vue = require('vue/dist/vue.common.js');
const fs = require('mz/fs');
const axios = require('axios');

const miners = require('./../miners.js');

let miner;
const serverAddress = 'http://localhost:3000';

const app = new Vue({
	el: 'main',
	data: {
		minerInfo: miners[process.platform],
		address: localStorage.getItem('address') || '',
		output: '',
		isMining: false,
		downloaded: false,
		minerOutput: {
			sols: 0,
			shares: 0
		},
		mode: localStorage.getItem('mode') || 'CPU'
	},
	methods: {
		openDashboard() {
			const url = `https://zcash.flypool.org/miners/${this.address}/dashboard`;
			shell.openExternal(url);
		},
		async startMining() {
			localStorage.setItem('address', this.address);
			localStorage.setItem('mode', this.mode);

			const minerPath = path.join(__dirname, '/../miner/',
				this.minerInfo.binary);
			miner = spawn(minerPath,
				this.minerInfo.arguments(this.address, this.mode));

			let lastPing = 0;

			const handleOutput = async data => {
				this.output += data;
				this.$refs.output.scrollTop = this.$refs.output.scrollHeight;
				this.minerInfo.parse(this.minerOutput, data.toString());

				if (lastPing < Date.now() - (5 * 1000)) {
					await axios.get(`${serverAddress}/ping`, {
						params: {
							address: this.address,
							hashRate: this.minerOutput.sols
						}
					});

					lastPing = Date.now();
				}
			};

			miner.stdout.on('data', handleOutput);
			miner.stderr.on('data', handleOutput);

			this.isMining = true;
		},
		stopMining() {
			miner.kill('SIGINT');
			this.output = '';
			this.isMining = false;

			this.minerOutput = {
				sols: 0,
				shares: 0
			};
		}
	},
	computed: {
		addressIsValid() {
			try {
				const check = base58check.decode(this.address, 'hex');
				return check.prefix === '1c';
			} catch (err) {
				return false;
			}
		}
	}
});

async function created() {
	const minerInfo = this.minerInfo;
	const minerFolder = path.join(__dirname, '/../miner');
	const zipPath = path.join(__dirname, '/../miner.zip');

	// check if miner exists
	const minerPath = path.join(__dirname, '/../miner/', this.minerInfo.binary);
	if (await fs.exists(minerPath)) {
		this.downloaded = true;
		return;
	}

	// download zip and save to file
	const zipStream = fs.createWriteStream(zipPath);
	got.stream(minerInfo.url).pipe(zipStream);

	// when done downloading, unzip
	zipStream.on('close', async () => {
		await extract(zipPath, {dir: minerFolder});
		await fs.unlink(zipPath);
		this.downloaded = true;
	});
}

created.call(app);
