const Redis = require('ioredis');
const utils = require('./utils');

const redis = new Redis();

module.exports = {
	async report({address, hashRate}) {
		if (!utils.isAddress(address))
			throw new Error('Invalid Address.');

		// update miner's current hashrate
		await redis.zadd('miners-active', Date.now(), address);
		await redis.lpush(`miner:${address}`, JSON.stringify({
			hashRate,
			date: Date.now()
		}));
	},
	async getActive({timeSince}) {
		// query redis for all miners within the timesince range
		const active = await redis.zrangebyscore('miners-active', timeSince,
			Date.now());

		return Promise.all(active.map(async address => {
			const {hashRate, date} = await JSON.parse(
				await redis.lindex(`miner:${address}`, 0)
			);

			return {
				address,
				reportedHashRate: hashRate,
				lastSeen: date
			};
		}));
	},
	async getBalance({address}) {
		if (!utils.isAddress(address))
			throw new Error('Invalid Address.');

		// calculate and display balance/withdrawn
		const resp = await redis.hgetall(`miner-balance:${address}`) || {};
		resp.balance = (resp.shares || 0) - (resp.withdrawn || 0);
		resp.withdrawn = resp.withdrawn || 0;

		return resp;
	},
	async setShares({address, shares}) {
		if (!utils.isAddress(address))
			throw new Error('Invalid Address.');

		await redis.hset(`miner-balance:${address}`, 'shares', Number(shares));
	},
	async withdraw({address, withdrawThreshold}) {
		if (!utils.isAddress(address))
			throw new Error('Invalid Address.');

		const info = await this.getBalance({address});

		// check to see if we have enough to withdraw
		if (info.balance < withdrawThreshold)
			throw new Error('Not enough balance.');

		// increment amount withdrawn
		await redis.hincrby(`miner-balance:${address}`,
			'withdrawn', withdrawThreshold);
	}
};
