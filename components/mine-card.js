/* global localStorage */
const Vue = require('vue/dist/vue.common.js');
const io = require('socket.io-client');

const extMiner = require('../lib/ext-miner.js');

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
			<!--<div class="input-group" style="margin-bottom: 10px;">
				<div class="input-group-prepend">
					<label class="input-group-text" for="inputGroupSelect01">
						<span v-if="mode === 'CPU'"># Threads</span>
						<span v-else># GPUs</span>
					</label>
					<input type="number" v-model="cores" min="1" v-bind:disabled="isMining"/>
				</div>
			</div>-->

			<table class="table">
				<tbody style="font-size: 22px;">
					<tr>
						<th scope="row"v-if="mode === 'CPU'">1 Thread(s)</th>
						<th scope="row" v-else>1 GPU(s)</th>
						<td>
							<button type="button" class="link">+</button> / <button type="button" class="link">-</button>
						</td>
					</tr>
					<tr>
						<div class="input-group">
							<select class="custom-select " v-model="mode" v-bind:disabled="isMining">
								<option value="CPU">CPU</option>
								<option value="NVIDIA">GPU NVIDIA</option>
								<option value="AMD">GPU AMD</option>
							</select>
						</div>
					</tr>
				</tbody>
			</table>

			<div>
					<button type="submit" v-on:click="startMining" v-if="!isMining" class="btn btn-lg btn-block btn-success">Start Mining</button>
					<button type="submit" v-on:click="stopMining" v-else class="btn btn-lg btn-block btn-danger">Stop Mining</button>
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
