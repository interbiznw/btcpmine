/* global describe, beforeEach, afterEach, it */
const assert = require('assert');
const path = require('path');
const {Application} = require('spectron');

describe('Electron Front-End', () => {
	describe('Application launch', function () {
		this.timeout(10000);

		beforeEach(async function () {
			this.app = new Application({
				path: require('electron'),
				args: [path.join(__dirname, '..')]
			});

			await this.app.start();
		});

		afterEach(function () {
			if (this.app && this.app.isRunning()) {
				return this.app.stop();
			}
		});

		it('shows an initial window', async function () {
			const count = await this.app.client.getWindowCount();

			assert.equal(count, 1);
		});
	});
});
