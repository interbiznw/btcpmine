/* global it, describe, before */
const chai = require('chai');
const supertest = require('supertest');

const app = require('../server');
const helper = require('./helper');

const api = supertest('http://localhost:' + 3000);

describe('Server Routes', () => {
	before(done => {
		app.listen(3000, done);
	});

	describe('Index Route', () => {
		it('index should return ok', async () => {
			await api.get('/').expect(200);
		});
		it('index with since added', async () => {
			await api.get('/?since=10000').expect(200);
		});
	});

	describe('Balance Route', () => {
		it('balance should return ok', async () => {
			await api.get(`/balance/${helper.validAddr}`).expect(200);
		});
		it('invalid address', async () => {
			await api.get(`/balance/${helper.invalidAddr}`).expect(500);
		});
	});

	describe('Withdraw Route', () => {
		it('withdraw should return ok', async () => {
			await api.get(`/withdraw/${helper.validAddr}`).expect(200);
		});
		it('invalid address', async () => {
			await api.get(`/withdraw/${helper.invalidAddr}`).expect(500);
		});
	});

	describe('Daemon', () => {
		it('daemon runs and returns true', async () => {
			const result = await app.daemon();
			chai.expect(result).to.equal(true);
		});
	});
});
