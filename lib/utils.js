const base58check = require('base58check');

/**
 * Check if the address is a valid zcash address.
 * @param {string} address A supposed zcash address.
 * @returns {boolean} Is or is not a zcash address.
 */

function isAddress(address) {
	try {
		const check = base58check.decode(address.trim(), 'hex');

		return check.prefix === '1c';
	} catch (err) {
		return false;
	}
}

module.exports.isAddress = isAddress;
