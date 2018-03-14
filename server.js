/* eslint capitalized-comments: ["error", "never"] */
/* eslint curly: ["error", "multi"] */

const Koa = require('koa');
const Router = require('koa-router');
const Redis = require('ioredis');
const json = require('koa-json');

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

app
	.use(json())
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(3000);
