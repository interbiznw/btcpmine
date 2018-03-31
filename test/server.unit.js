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
	});
});
