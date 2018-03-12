/* global localStorage */
/* eslint capitalized-comments: ["error", "never"] */

const fs = require('fs');
const path = require('path');
const util = require('util');
const {spawn} = require('child_process');
const base58check = require('base58check');
const got = require('got');
const extract = util.promisify(require('extract-zip'));
const Vue = require('vue/dist/vue.common.js');

const miners = require('./../miners.js');

let miner;

const app = new Vue({
	el: 'main',
	data: {
		minerInfo: miners[process.platform],
		address: localStorage.getItem('address') || '',
		output: '',
		isMining: false,
		downloaded: false
	},
	methods: {
		startMining() {
			localStorage.setItem('address', this.address);

			const minerPath = path.join(__dirname, '/../miner/',
				this.minerInfo.binary);
			miner = spawn(minerPath, this.minerInfo.arguments(this.address));

			miner.stdout.on('data', data => {
				this.output += data;
			});

			miner.stderr.on('data', data => {
				this.output += data;
			});

			this.isMining = true;
		},
		stopMining() {
			miner.kill('SIGINT');
			this.output = '';
			this.isMining = false;
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

	// download zip and save to file
	const zipStream = fs.createWriteStream(zipPath);
	got.stream(minerInfo.url).pipe(zipStream);

	// when done downloading, unzip
	zipStream.on('close', async () => {
		await extract(zipPath, {dir: minerFolder});
		this.downloaded = true;
	});
}

created.call(app);
