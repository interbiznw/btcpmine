const base58check = require('base58check');
const got = require("got");
const fs = require('fs');
const util = require("util");
const extract = util.promisify(require('extract-zip'));

const Vue = require("vue/dist/vue.common.js");
const { spawn } = require('child_process');

const miners = require("./../miners.js");
let miner;

const app = new Vue({
  el: "main",
  data: {
    minerInfo: miners[process.platform],
    address: localStorage.getItem('address') || "",
    output: "",
    isMining: false,
    downloaded: false
  },
  methods: {
    startMining() {
      localStorage.setItem('address', this.address);

      miner = spawn(__dirname + "/../miner/" + this.minerInfo.binary, this.minerInfo.arguments(this.address));

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
  },
});

async function created() {
  const minerInfo = this.minerInfo;

  const minerFolder = __dirname + "/../miner";
  const zipPath = __dirname + "/../miner.zip";
  const zipStream = fs.createWriteStream(zipPath);

  got.stream(minerInfo.url)
    .pipe(zipStream);

  zipStream.on("close", async () => {
      await extract(zipPath, {dir: minerFolder});
      this.downloaded = true;
  });
}

created.call(app);
