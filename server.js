const Koa = require('koa');
const Router = require('koa-router');
const Redis = require('ioredis');
const json = require('koa-json');
const axios = require('axios');
const io = require('socket.io')(3010);

// internal libs
const utils = require('./lib/utils');
const db = require('./lib/db');

// vars
const app = new Koa();
const router = new Router();
const redis = new Redis();

// report hashrate via socket.io
io.on('connection', socket => {
	socket.on('hashrate', async ({address, hashRate}) => {
		await db.report({address, hashRate});
	});
});

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.statusCode || err.status || 500;
		ctx.body = {};
	}
});

router.get('/', async ctx => {
	// convert the timesince seconds into a timestamp (default 60 seconds)
	const timeSince = typeof ctx.query.since === 'undefined' ?
		Date.now() - (60 * 1000) : Date.now() - Number(ctx.query.since);

	// all active miners as json
	ctx.body = {
		active: await db.getActive({timeSince})
	};
});

router.get('/balance/:address', async ctx => {
	ctx.body = await db.getBalance({
		address: ctx.params.address
	});
});

const withdrawThreshold = 1;

router.get('/withdraw/:address', async ctx => {
	await db.withdraw({
		address: ctx.params.address,
		withdrawThreshold
	});

	ctx.body = {};
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

	return true;
}

app
	.use(json())
	.use(router.routes())
	.use(router.allowedMethods());

/* istanbul ignore next */
// start the server, if running this script alone
if (require.main === module) {
	// start daemon
	daemon().catch(e => console.log(e));
	setInterval(() => daemon().catch(e => console.log(e)), 5 * 60 * 1000);

	// start webserver
	app.listen(3000, () => {
		console.log('Server started! At http://localhost:' + 3000);
	});
}

module.exports = app;
module.exports.daemon = daemon;
