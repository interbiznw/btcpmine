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
	  <div class="card text-center box-shadow">
		<div class="card-header">
		  <ul class="nav nav-tabs card-header-tabs">
			<li class="nav-item">
			  <a class="nav-link active" href="#">Log</a>
			</li>
		  </ul>
		</div>
		<div class="card-body">
		  <textarea class="form-control" disabled style="height: 230px; font-size: 12px; margin-bottom:10px;" ref="output">{{output}}</textarea>
		</div>
	  </div>
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
		WalletCard: require('./wallet-card')
	}
});
