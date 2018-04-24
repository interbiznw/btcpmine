const Koa = require('koa');
const Router = require('koa-router');
const Redis = require('ioredis');
const json = require('koa-json');
const axios = require('axios');
const io = require('socket.io')(3010);

// internal libs
const utils = require('./lib/utils');

// vars
const app = new Koa();
const router = new Router();
const redis = new Redis();

// report hashrate via socket.io
io.on('connection', socket => {
	socket.on('hashrate', async ({address, hashRate}) => {
		if (!utils.isAddress(address)) throw new Error('Invalid Address.');

		// update miner's current hashrate
		await redis.zadd('miners-active', Date.now(), address);
		await redis.lpush(`miner:${address}`, JSON.stringify({
			hashRate,
			date: Date.now()
		}));
	});
});

router.get('/', async ctx => {
	// convert the timesince seconds into a timestamp (default 60 seconds)
	const timeSince = typeof ctx.query.since === 'undefined' ?
		Date.now() - (60 * 1000) : Date.now() - Number(ctx.query.since);

	// query redis for all miners within the timesince range
	const active = await redis.zrangebyscore('miners-active', timeSince,
		Date.now());

	// return all active miners as json
	ctx.body = {
		active: await Promise.all(active.map(async address => {
			const {hashRate, date} = await JSON.parse(
				await redis.lindex(`miner:${address}`, 0));
			return {
				address,
				reportedHashRate: hashRate,
				lastSeen: date
			};
		}))
	};
});

router.get('/balance/:address', async ctx => {
	if (!utils.isAddress(ctx.params.address)) ctx.throw(401, 'Invalid Address.');

	// calculate and display balance/withdrawn
	ctx.body = await redis.hgetall(`miner-balance:${ctx.params.address}`) || {};
	ctx.body.balance = (ctx.body.shares || 0) - (ctx.body.withdrawn || 0);
	ctx.body.withdrawn = ctx.body.withdrawn || 0;
});

const withdrawThreshold = 1;

router.get('/withdraw/:address', async ctx => {
	if (!utils.isAddress(ctx.params.address)) ctx.throw(401, 'Invalid Address.');

	const info = await redis.hgetall(`miner-balance:${ctx.params.address}`) || {};
	const shares = info.shares || 0;
	const withdrawn = info.withdrawn || 0;
	const balance = shares - withdrawn;

	let success = false;

	// check to see if we have enough to withdraw
	if (balance > withdrawThreshold) {
		await redis.hincrby(`miner-balance:${ctx.params.address}`,
			'withdrawn', withdrawThreshold);
		success = true;
	}

	ctx.body = {success};
});

// https://api.nanopool.org/v1/zec/shareratehistory/:address/:worker
// gets # shares for an address
// withdraws # of shares for an address

async function daemon() {
	const address = 't1YtcRXgoDsVj6sDhGA71sgdDLoR9Q1QcnL';
	const url = `https://api-zcash.flypool.org/miner/${address}/dashboard`;
	const {data: {data}} = await axios.get(url);

	for (const {worker, validShares} of data.workers)
		await redis.hset(`miner-balance:${worker}`, 'shares', validShares);
}

app
	.use(json())
	.use(router.routes())
	.use(router.allowedMethods());

/* istanbul ignore next */
// start the server, if running this script alone
if (require.main === module)
	// start daemon
	daemon().catch(e => console.log(e));
	setInterval(() => daemon().catch(e => console.log(e)), 5 * 60 * 1000);

	// start webserver
	app.listen(3000, () => {
		console.log('Server started! At http://localhost:' + 3000);
	});

module.exports = app;
