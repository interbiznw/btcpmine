const Vue = require("vue/dist/vue.common.js");
const { spawn } = require('child_process');
const base58check = require('base58check');

const app = new Vue({
  el: "main",
  data: {
    address: "",
    output: ""
  },
  methods: {
    startMining() {
      const miner = spawn('nheqminer_nanopool_v0.4b/nheqminer.exe',
      ['-l',  'zec-us-east1.nanopool.org:6666',  '-u',  this.address,
       '-p', 'x']);

      miner.stdout.on("data", data => {
       this.output += data;
      });

      miner.stderr.on("data", data => {
       this.output += data;
      });
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
