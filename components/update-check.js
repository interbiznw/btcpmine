const axios = require('axios');
const Vue = require('vue/dist/vue.common.js');
const {version} = require('../package.json');

module.exports = Vue.component('update-check', {
	template: `
	<div class="alert alert-primary alert-dismissible fade show" role="alert" v-if="version !== latestVersion">
		<strong>Out of date!</strong> Please update zmine
		<a style="color: inherit; text-decoration: underline;" v-on:click="openExternal('https://github.com/super3/zmine/releases')" href="#">here</a>.
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
		const getLatestVersion = async () => {
			const packageUrl = 'https://raw.githubusercontent.com/super3/zmine/master/package.json';
			const {data: {version}} = await axios.get(packageUrl);
			this.latestVersion = version;
		};

		setInterval(getLatestVersion, 15 * 60 * 1000);
	}
});
