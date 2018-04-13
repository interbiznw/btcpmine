const {shell} = require('electron');
const Vue = require('vue/dist/vue.common.js');

const extMiner = require('../lib/ext-miner.js');

require('dotenv').config();

new Vue({
	el: '#app',
	data: {
		supported: extMiner.supported,
		downloaded: false
	},
	methods: {
		openExternal(url) {
			shell.openExternal(url);
		}
	},
	components: {
		MainPanel: require('../components/main-panel')
	},
	async created() {
		if (!this.supported)
			return;

		await extMiner.install();
		this.downloaded = true;
	}
});
