/* global localStorage */
const {shell} = require('electron');
const Vue = require('vue/dist/vue.common');
const utils = require('../lib/utils');

module.exports = Vue.component('wallet-card', {
	template: `
	<div class="card box-shadow">
		<div class="card-header">
			<h4 class="my-0 font-weight-normal">Wallet</h4>
		</div>
		<div class="card-body" v-if="mining">
			<h1 class="card-title pricing-card-title">{{minerOutput.shares}}
				<small class="text-muted">accepted shares</small>
			</h1>
			<button type="button"
				class="btn btn-lg btn-block btn-outline-primary"
				v-on:click="openExternal(\`https://pool.btcprivate.org/workers/\${address}\`)"
				v-bind:disabled="!addressIsValid">View Dashboard
			</button>
		</div>
		<div class="card-body" v-else>
			<label><b>Your Wallet Address:</b></label>
			<input type="text"
			  value="b19wScZz4bqURz7zQoztFGyoSqExpizKEuN"
				class="form-control bottom-space"
				v-bind:class="{ 'is-valid': addressIsValid, 'is-invalid': !addressIsValid}"
				style="width:100%;"
				v-model.trim="address"
				v-bind:disabled="mining"
			 >

       <label><b>Suggested Wallets:</b></label>
       <button
				 v-on:click="openExternal('https://paperwallet.btcprivate.org/')"
         class="btn btn-lg btn-block btn-outline-primary">
				 BTCP Paperwallet</button>
				 <button
					v-on:click="openExternal('https://github.com/BTCPrivate/electrum-btcp/releases')"
					 class="btn btn-lg btn-block btn-outline-primary">
					BTCP Electrum lite wallet</button>
		 </div>
	</div>
	`,
	props: ['mineroutput', 'mining'],
	data: () => ({
		address: ''
	}),
	computed: {
		addressIsValid() {
			return utils.isAddress(this.address);
		},
		minerOutput() {
			return this.mineroutput;
		}
	},
	methods: {
		openExternal(url) {
			shell.openExternal(url);
		}
	},
	watch: {
		address() {
			this.$emit('address-change', this.address);
		}
	},
	created() {
		this.address = localStorage.getItem('address') || '';
	}
});
