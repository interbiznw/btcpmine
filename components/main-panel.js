const Vue = require('vue/dist/vue.common.js');

module.exports = Vue.component('main-panel', {
	template: `<div>
	<div>
	  <div class="card-deck mb-3 text-center">
		<Wallet-Card
		  v-bind:mineroutput="minerOutput"
		  v-bind:mining="isMining"
		  v-on:address-change="addressChange"
		></Wallet-Card>

		<Mine-Card
		  v-bind:address="address"
		  v-on:update="minerUpdate"
		  v-on:start="isMining = true"
		  v-on:stop="isMining = false"
		></Mine-Card>
	  </div>
	</div>

		<div>
			<Log-Card v-bind:log="output"></Log-Card>
		</div>
	</div>`,
	data: () => ({
		output: '',
		isMining: false,
		downloaded: false,
		minerOutput: {},
		address: ''
	}),
	methods: {
		minerUpdate(output, minerOutput) {
			this.output = output;
			this.$refs.output.scrollTop = this.$refs.output.scrollHeight;

			this.minerOutput = minerOutput;
		},
		addressChange(address) {
			this.address = address;
		}
	},
	components: {
		UpdateCheck: require('./update-check'),
		MineCard: require('./mine-card'),
		WalletCard: require('./wallet-card'),
		LogCard: require('./log-card')
	}
});
