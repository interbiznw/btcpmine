const {shell} = require('electron');
const Vue = require('vue/dist/vue.common.js');

const extMiner = require('../lib/ext-miner.js');

require('dotenv').config();

new Vue({
	el: '#app',
	data: {
		output: '',
		isMining: false,
		downloaded: false,
		minerOutput: {},
		supported: extMiner.supported,
		address: ''
	},
	methods: {
		openExternal(url) {
			shell.openExternal(url);
		},
		minerUpdate(output, minerOutput) {
			this.output = output;
			this.$refs.output.scrollTop = this.$refs.output.scrollHeight;

			this.minerOutput = minerOutput;
		},
		addressChange(address) {
			this.address = address;
		}
	},
	async created() {
		const downloadMiner = async () => {
			await extMiner.install();
			this.downloaded = true;
		};

		await Promise.all([
			downloadMiner()
		]);

		console.log(this.minerOutput);
	},
	components: {
		UpdateCheck: require('../components/update-check'),
		MineCard: require('../components/mine-card'),
		WalletCard: require('../components/wallet-card')
	}
});
