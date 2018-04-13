const Vue = require('vue/dist/vue.common.js');

module.exports = Vue.component('wallet-card', {
	template: `<div class="card text-center box-shadow">
		<div class="card-header">
		  <ul class="nav nav-tabs card-header-tabs">
			<li class="nav-item">
			  <a class="nav-link active" href="#">Log</a>
			</li>
		  </ul>
		</div>
		<div class="card-body">
		  <textarea class="form-control" disabled style="height: 230px; font-size: 12px; margin-bottom:10px;" ref="output">{{log}}</textarea>
		</div>
	  </div>`,
	props: ['log'],
	watch: {
		log() {
			this.$refs.output.scrollTop = this.$refs.output.scrollHeight;
		}
	}
});
