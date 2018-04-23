/* global it, describe, before */
const supertest = require('supertest');

const app = require('../server');

const api = supertest('http://localhost:' + 3000);

describe('Server Routes', () => {
	before(done => {
		app.listen(3000, done);
	});

	describe('Index Route', () => {
		it('index should return a 200 response', async () => {
			await api.get('/').expect(200);
		});
		it('index with since added', async () => {
			await api.get('/?since=10000').expect(200);
		});
	});

	describe('Balance Route', () => {

	});

	describe('Withdraw Route', () => {

	});
});
