/* global localStorage */
const Vue = require('vue/dist/vue.common');
const io = require('socket.io-client');

// internal libs
const extMiner = require('../lib/ext-miner.js');

// vars
const socket = io(process.env.DEV ? 'http://localhost:3010' :
	'http://zfaucet.org:3010');

module.exports = Vue.component('mine-card', {
	template: `
	<div class="card box-shadow">
		<div class="card-header">
			<h4 class="my-0 font-weight-normal">Mine</h4>
		</div>
		<div class="card-body">
			<h1 class="card-title pricing-card-title">
				{{minerOutput.sols}} <small class="text-muted"> sol/s </small>
			</h1>

			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<label class="input-group-text" for="mode">Mode</label>
				</div>
				<select class="custom-select" id="mode"
					v-model="mode" v-bind:disabled="isMining">
					<option value="CPU">NiceHash v0.5c - CPU</option>
					<option value="NVIDIA">NiceHash v0.5c - GPU NVIDIA</option>
					<option value="AMD">NiceHash v0.5c - GPU AMD</option>
				</select>
			</div>

			<div class="input-group mb-3">
			  <div class="input-group-prepend">
			    <span class="input-group-text" v-if="mode === 'CPU'">Threads</span>
					<span class="input-group-text" v-else>GPUs</span>
			  </div>
				<input class="form-control" type="number" v-model="cores"
					min="1" max="16" v-bind:disabled="isMining"/>
				<div class="input-group-append">
					<button class="btn btn-outline-secondary" type="button" v-bind:disabled="isMining">+</button>
					<button class="btn btn-outline-secondary" type="button" v-bind:disabled="isMining">-</button>
				</div>
			</div>

			<div>
					<button type="submit"
						v-on:click="startMining"
						v-if="!isMining"
						class="btn btn-lg btn-block btn-success"
					>
					<span class="oi oi-play-circle center-icon" style="top: 4px; margin-right: 3px;"></span>
						Start Mining
					</button>
					<button type="submit"
						v-on:click="stopMining"
						v-else
						class="btn btn-lg btn-block btn-danger"
					>
						<span class="oi oi-media-stop center-icon" style="top: 4px; margin-right: 3px;"></span>
						Stop Mining
					</button>
			</div>

		</div>
	</div>
	`,
	props: ['address'],
	data: () => ({
		output: '',
		isMining: false,
		downloaded: false,
		minerOutput: {
			sols: 0,
			shares: 0
		},
		mode: localStorage.getItem('mode') || 'CPU',
		cores: localStorage.getItem('cores') || 1
	}),
	methods: {
		async startMining() {
			localStorage.setItem('address', this.address);
			localStorage.setItem('mode', this.mode);
			localStorage.setItem('cores', this.cores);

			let lastPing = 0;

			extMiner.start(this.address, this.mode, this.cores, async (minerOutput, data) => {
				this.minerOutput = minerOutput;

				this.output += data;
				this.$emit('update', this.output, this.minerOutput);

				if (lastPing < Date.now() - (5 * 1000)) {
					socket.emit('hashrate', {
						address: this.address,
						hashRate: this.minerOutput.sols
					});

					lastPing = Date.now();
				}
			});

			this.isMining = true;
			this.$emit('start');
		},
		stopMining() {
			extMiner.stop();
			this.isMining = false;
			this.$emit('stop');

			this.output = '';
			this.minerOutput = {
				sols: 0,
				shares: 0
			};
		}
	}
});
