const Vue = require("vue/dist/vue.common.js");
const { spawn } = require('child_process');
const base58check = require('base58check');
let miner;

const app = new Vue({
  el: "main",
  data: {
    address: localStorage.getItem('address') || "",
    output: "",
    isMining: false
  },
  methods: {
    startMining() {
      localStorage.setItem('address', this.address);

      miner = spawn('nheqminer_nanopool_v0.4b/nheqminer.exe',
      ['-l',  'zec-us-east1.nanopool.org:6666',  '-u',  `t1YtcRXgoDsVj6sDhGA71sgdDLoR9Q1QcnL/${this.address}`,
       '-cd', '0', '-p', 'x']);

      miner.stdout.on("data", data => {
       this.output += data;
      });

      miner.stderr.on("data", data => {
       this.output += data;
      });
      this.isMining = true;
    },
    stopMining() {
      miner.kill('SIGINT');
      this.output = '';
      this.isMining = false;
    }
  },
  computed: {
    addressIsValid() {
      try {
        const check = base58check.decode(this.address, 'hex');
        return check.prefix === '1c';
      } catch (err) {
        return false;
      }
    }
  }
});
