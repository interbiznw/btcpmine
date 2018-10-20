const {shell} = require('electron');
const axios = require('axios');
const Vue = require('vue/dist/vue.common');
const {version} = require('../package.json');
const appVersion = require('../package.json').version;

module.exports = Vue.component('update-check', {
	template: `
	<div class="alert alert-warning alert-dismissible fade show"
		role="alert" v-if="version !== latestVersion">
		<strong>Out of date!</strong> Please update btcpmine
		<a style="color: inherit; text-decoration: underline;"
		v-on:click="openExternal('https://github.com/interbiznw/btcpmine/releases')"
			href="javascript:void(0);">here</a>.
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	`,
	data: () => ({
		version,
		latestVersion: version
	}),
	async created() {
		const startupCheckNewVersion = async () => {
			const packageUrl = 'https://raw.githubusercontent.com/interbiznw/btcpmine/master/package.json';
			const {data: {version}} = await axios.get(packageUrl);
			this.latestVersion = version;
			document = this;
			document.getElementById("version").innerHTML = 'Current Version: ' + appVersion;
			console.log('firstcheck on load');
		};

		startupCheckNewVersion();

		const getLatestVersion = async () => {
			const packageUrl = 'https://raw.githubusercontent.com/interbiznw/btcpmine/master/package.json';
			const {data: {version}} = await axios.get(packageUrl);
			this.latestVersion = version;
			console.log('subsequent timed checks');
		};

		// check every 15 minutes
		setInterval(getLatestVersion, 15 * 60 * 1000);
	},
	methods: {
		openExternal(url) {
			shell.openExternal(url);
		}
	}

});
