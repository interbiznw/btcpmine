const EventEmitter = require('events').EventEmitter;

class Parser extends EventEmitter {
	constructor() {
		super();

		this.state = {
			sols: 0,
			shares: 0
		};
	}

	set state(state) {
		state.sols = state.sols.toFixed(2);

		this._state = state;
		this.emit('update', this._state);
	}

	get state() {
		return this._state;
	}

	write(line) {
		this.emit('raw', line);

		const parts = line
			.split(' ')
			.filter(part => part.length > 0)
			.map(part => part.trim().toLowerCase());

		console.log(parts);

		parts.forEach((part, i) => {
			if (parts[i].startsWith('sol/s') || parts[i].startsWith('sols/s')) {
				let sols;

				// `x Sols/s`
				sols = Number(parts[i - 1]);

				if (!isNaN(sols))
					this.state = Object.assign({}, this.state, {sols});

				// `Sols/s x`
				sols = Number(parts[i + 1]);

				if (!isNaN(sols))
					this.state = Object.assign({}, this.state, {sols});
			}
		});

		if (parts[parts.length - 1] === '+') {
			this.state = Object.assign({}, this.state, {
				shares: this.state.shares + 1
			});
		}

		if (parts.indexOf('accepted') > -1 && parts.indexOf('share') > -1) {
			this.state = Object.assign({}, this.state, {
				shares: this.state.shares + 1
			});
		}
	}
}

module.exports = Parser;
