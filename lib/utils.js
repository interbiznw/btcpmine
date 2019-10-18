const base58check = require('base58check');

/**
 * Check if the address is a valid zcash address.
 * @param {string} address A supposed zcash address.
 * @returns {boolean} Is or is not a zcash address.
 */

function isAddress(address) {
	try {
		const check = base58check.decode(address.trim(), 'hex');
		// 13 btcpmainnet
		// 19 btcprebase testnet
		return check.prefix === '13';
	} catch (err) {
		return false;
	}
}

module.exports.isAddress = isAddress;
