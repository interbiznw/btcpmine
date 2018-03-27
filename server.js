/* eslint capitalized-comments: ["error", "never"] */
/* eslint curly: ["error", "multi"] */

const Koa = require('koa');
const Router = require('koa-router');
const Redis = require('ioredis');
const json = require('koa-json');
const axios = require('axios');

const app = new Koa();
const router = new Router();
const redis = new Redis();
const base58check = require('base58check');

function isAddress(address) {
	try {
		const check = base58check.decode(address, 'hex');
		return check.prefix === '1c';
	} catch (err) {
		return false;
	}
}

router.get('/', async ctx => {
	const active = await redis.zrangebyscore('miners-active', Date.now() - (60 * 1000),
		Date.now());

	ctx.body = {
		message: 'Hello, World!',
		counter: await redis.incr('counter'),
		active: await Promise.all(active.map(async address => {
			const {hashRate} = await JSON.parse(await redis.lindex(`miner:${address}`, 0));
			return {
				address,
				reportedHashRate: hashRate
			};
		}))
	};
});

router.get('/ping', async ctx => {
	if (!isAddress(ctx.query.address)) throw new Error('Invalid Address.');

	await redis.zadd('miners-active', Date.now(), ctx.query.address);
	await redis.lpush(`miner:${ctx.query.address}`, JSON.stringify({
		hashRate: ctx.query.hashRate,
		date: Date.now()
	}));

	ctx.body = {};
});

router.get('/balance/:address', async ctx => {
	ctx.body = await redis.hgetall(`miner-balance:${ctx.params.address}`) || {};
	ctx.body.balance = (ctx.body.shares || 0) - (ctx.body.withdrawn || 0);
	ctx.body.withdrawn = ctx.body.withdrawn || 0;
});

const withdrawThreshold = 1;

router.get('/withdraw/:address', async ctx => {
	const info = await redis.hgetall(`miner-balance:${ctx.params.address}`) || {};

	const shares = info.shares || 0;
	const withdrawn = info.withdrawn || 0;
	const balance = shares - withdrawn;

	let success = false;

	if (balance > withdrawThreshold) {
		await redis.hincrby(`miner-balance:${ctx.params.address}`, 'withdrawn', withdrawThreshold);
		success = true;
	}

	ctx.body = {success};
});

// https://api.nanopool.org/v1/zec/shareratehistory/:address/:worker
// gets # shares for an address
// withdraws # of shares for an address

async function daemon() {
	const url = `https://api-zcash.flypool.org/miner/t1YtcRXgoDsVj6sDhGA71sgdDLoR9Q1QcnL/dashboard`;
	const {data: {data}} = await axios.get(url);

	for (const {worker, validShares} of data.workers)
		await redis.hset(`miner-balance:${worker}`, 'shares', validShares);
}

setInterval(() => daemon().catch(e => console.log(e)), 5 * 60 * 1000);
daemon().catch(e => console.log(e));

app
	.use(json())
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(3000);
