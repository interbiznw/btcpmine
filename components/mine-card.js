/* global localStorage */
const Vue = require('vue/dist/vue.common');
const io = require('socket.io-client');

// internal libs
const extMiner = require('../lib/ext-miner');
const utils = require('../lib/utils');

// vars
const socket = io(process.env.DEV ? 'http://localhost' :
	'http://pool.btcprivate.org');

module.exports = Vue.component('mine-card', {
	template: `
	<div class="card box-shadow">
		<div class="card-header">
			<h4 class="my-0 font-weight-normal">Mine</h4>
		</div>
		<div class="card-body">
			<h1 class="card-title pricing-card-title">
				{{minerOutput.sols}} <small class="text-muted"> sol/s</small>
			</h1>

			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<label class="input-group-text" for="mode">Mode</label>
				</div>

				<select class="custom-select" id="mode"
					v-model="mode" v-bind:disabled="isMining" v-on:change="modeChange">
					<option value="GPU">GPU</option>
				</select>
			</div>
	    <div class="input-group mb-3">
				<div class="input-group-prepend">
					<label class="input-group-text" for="miner">Miners</label>
				</div>

				<select class="custom-select" id="miner"
					v-model="miner" v-bind:disabled="isMining" v-on:change="minerChange">
					<option v-if="mode === 'GPU'" value="Gminer 1.70">Gminer 1.70 - NVIDIA & AMD GPU</option>
					<option v-if="mode === 'GPU'" value="lolMiner v0.8.8">lolMiner v0.8.8 - NVIDIA & AMD GPU</option>
					<option v-if="mode === 'GPU'" value="miniZ v1.5">miniZ v1.5 - NVIDIA GPU</option>
					<option v-if="mode === 'GPU'" value="EWBF-0.6">EWBF-0.6 - NVIDIA GPU</option>
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
					<button class="btn btn-outline-secondary"
						type="button"
						v-bind:disabled="isMining"
						v-on:click="upCores"
						>+</button>
					<button class="btn btn-outline-secondary"
						type="button"
						v-bind:disabled="isMining"
						v-on:click="downCores"
						>-</button>
				</div>
			</div>

			<div>
					<button type="submit"
						v-on:click="startMining"
						v-if="!isMining"
						v-bind:disabled="!validAddress"
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
		mode: localStorage.getItem('mode') || 'GPU',
		cores: localStorage.getItem('cores') || 1,
		miners: extMiner.miners,
		miner: localStorage.getItem('miner') || 'EWBF-0.6'
	}),

	computed: {
		validAddress() {
			return utils.isAddress(this.address);
		}
	},
	methods: {
		upCores() {
			if (this.cores < 16) this.cores++;
			localStorage.setItem('cores', this.cores);
		},
		downCores() {
			if (this.cores > 1) this.cores--;
			localStorage.setItem('cores', this.cores);
		},
		modeChange() {
			localStorage.setItem('mode', this.mode);
		},
		minerChange() {
			localStorage.setItem('miner', this.miner);
		},
		async startMining() {
			localStorage.setItem('address', this.address);
			localStorage.setItem('mode', this.mode);
			localStorage.setItem('cores', this.cores);
			localStorage.setItem('miner', this.miner);

			let lastPing = 0;

			const parser = await extMiner.start(this.address, this.miner, this.cores);

			console.log(parser);

			parser.on('raw', data => {
				this.output += data.toString();

				this.$emit('update', this.output, this.minerOutput);
			});

			parser.on('update', async minerOutput => {
				console.log(minerOutput);
				this.minerOutput = minerOutput;

				this.$emit('update', this.output, this.minerOutput);

				if (lastPing < Date.now() - (5 * 1000)) {
					socket.emit('statusReport', {
						address: this.address,
						isMining: true,
						hashRate: this.minerOutput.sols,
						withdrawPercent: 100,
						algorithm: 'zec'
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
