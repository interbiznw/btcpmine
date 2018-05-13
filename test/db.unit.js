/* global it, describe */

const chai = require('chai');
chai.use(require('chai-as-promised'));

const db = require('../lib/db');
const helper = require('./helper');

describe('Database', () => {
	describe('Miner Status', () => {
			it('valid report', async () => {
				const minerStatus = {address: helper.validAddr, hashRate: 50};
				chai.expect(await db.report(minerStatus)).to.equal(true);
			});

			it('invalid address in report', async () => {
				const minerStatus = {address: helper.invalidAddr, hashRate: 50};
				await chai.assert.isRejected(db.report(minerStatus));
			});

			it('invalid hashrate in report', async () => {
				const minerStatus = {address: helper.validAddr, hashRate: 'bad'};
				await chai.assert.isRejected(db.report(minerStatus));
			});

			it('check activer miners', async () => {
				const timeSince = 10;
				const expectResp = [
					{
						address: 't1aZvxRLCGVeMPFXvqfnBgHVEbi4c6g8MVa',
						reportedHashRate: 50,
						lastSeen: 1526177350409
					}
				];
				const resp = await db.getActive({timeSince});
				chai.expect(resp.address).to.equal(expectResp.address);
				chai.expect(resp.reportedHashRate).to.equal(expectResp.reportedHashRate);
			});
	});
	describe('Share Management', () => {
		describe('Get Balance/Set Shares', () => {
			it('invalid address', async () => {
				const addr = {address: helper.invalidAddr};
				await chai.assert.isRejected(db.getBalance(addr));
			});

			it('check empty balance', async () => {
				const resp = await db.getBalance({address: 't1fUTVEY1nFVVvSzb6q4AC6uMiugg729q9k'});
				chai.expect(resp.shares).to.equal(0);
				chai.expect(resp.balance).to.equal(0);
				chai.expect(resp.withdrawn).to.equal(0);
			});

			it('invalid address', async () => {
				const shares = {address: helper.invalidAddr, shares: 50};
				await chai.assert.isRejected(db.setShares(shares));
			});
			it('invalid shares', async () => {
				const shares = {address: helper.validAddr, shares: 'bad'};
				await chai.assert.isRejected(db.setShares(shares));
			});

			it('check balance', async () => {
				await db.setShares({address: helper.validAddr, shares: 50});
				const resp = await db.getBalance({address: helper.validAddr});
				chai.expect(resp.shares).to.equal(50);
				chai.expect(resp.balance).to.equal(50);
				chai.expect(resp.withdrawn).to.equal(0);
			});
		});
		describe('Withdraw', () => {
			it('set balance', async () => {
				await db.setShares({address: helper.validAddr, shares: 50});
			});
			it('invalid address', async () => {
				const withdraw = {address: helper.invalidAddr, withdrawThreshold: 50};
				await chai.assert.isRejected(db.withdraw(withdraw));
			});
			it('withdraw 10', async () => {
				await db.withdraw({address: helper.validAddr, withdrawThreshold: 25});
				const resp = await db.getBalance({address: helper.validAddr});
				chai.expect(resp.shares).to.equal(50);
				chai.expect(resp.balance).to.equal(25);
				chai.expect(resp.withdrawn).to.equal(25);
			});
			it('withdraw too much', async () => {
				const withdraw = {address: helper.validAddr, withdrawThreshold: 150};
				await chai.assert.isRejected(db.withdraw(withdraw));
			});
		});
	});
});
