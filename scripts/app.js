/* global localStorage */

const {shell} = require('electron');
const base58check = require('base58check');
const Vue = require('vue/dist/vue.common.js');
const axios = require('axios');

const {version} = require('../package.json');
const extMiner = require('../lib/ext-miner.js');

require('dotenv').config();

const serverAddress = process.env.DEV ? 'http://localhost:3000' :
	'http://zfaucet.org:3000';

new Vue({
	el: '#app',
	data: {
		address: localStorage.getItem('address') || '',
		output: '',
		isMining: false,
		downloaded: false,
		minerOutput: {
			sols: 0,
			shares: 0
		},
		mode: localStorage.getItem('mode') || 'CPU',
		supported: extMiner.supported,
		version,
		latestVersion: version,
		cores: localStorage.getItem('cores') || 1
	},
	methods: {
		openExternal(url) {
			shell.openExternal(url);
		},
		async startMining() {
			localStorage.setItem('address', this.address);
			localStorage.setItem('mode', this.mode);
			localStorage.setItem('cores', this.cores);

			let lastPing = 0;

			extMiner.start(this.address, this.mode, this.cores, async (minerOutput, data) => {
				this.minerOutput = minerOutput;

				this.output += data;
				this.$refs.output.scrollTop = this.$refs.output.scrollHeight;

				if (lastPing < Date.now() - (5 * 1000)) {
					await axios.get(`${serverAddress}/ping`, {
						params: {
							address: this.address,
							hashRate: this.minerOutput.sols
						}
					});

					lastPing = Date.now();
				}
			});

			this.isMining = true;
		},
		stopMining() {
			extMiner.stop();
			this.isMining = false;

			this.output = '';
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
	},
	async created() {
		const getLatestVersion = async () => {
			const packageUrl = 'https://raw.githubusercontent.com/super3/zmine/master/package.json';
			const {data: {version}} = await axios.get(packageUrl);
			this.latestVersion = version;
		};

		const downloadMiner = async () => {
			await extMiner.install();
			this.downloaded = true;
		};

		await Promise.all([
			getLatestVersion(),
			downloadMiner()
		]);
	}
});
