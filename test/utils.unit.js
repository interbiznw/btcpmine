/* global it, describe */

const chai = require('chai');

const utils = require('../lib/utils');
const helper = require('./helper');

describe('Backend Utils', () => {
	describe('isAddress function', () => {
		it('valid taddress', () => {
			chai.expect(utils.isAddress(helper.validAddr)).to.equal(true);
		});
		it('invalid taddress', () => {
			chai.expect(utils.isAddress('notvalidaddress')).to.equal(false);
		});
		it('wrong length', () => {
			chai.expect(utils.isAddress('t1Zo4ZtTpu7tvdXvZRBZvC'))
				.to.equal(false);
		});
		it('changed address', () => {
			chai.expect(utils.isAddress(helper.invalidAddr)).to.equal(false);
		});
		it('bitcoin address', () => {
			const bitcoinAddress = '1mayif3H2JDC62S4N3rLNtBNRAiUUP99k';
			chai.expect(utils.isAddress(bitcoinAddress)).to.equal(false);
		});
	});
});
