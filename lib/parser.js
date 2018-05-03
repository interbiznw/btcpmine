const EventEmitter = require('events');

class Parser extends EventEmitter {
	constructor() {
		super();

		this.state = {
			sols: 0,
			shares: 0
		};
	}

	set state(state) {
		this._state = state;
		this.emit('update', this._state);
	}

	get state() {
		return this._state;
	}

	write(line) {
		const parts = line
			.split(' ')
			.filter(part => part.length > 0)
			.map(part => part.trim().toLowerCase());

		parts.forEach((part, i) => {
			if (parts[i].startsWith('sol/s')) {
				// `Sols/s x`
				let sols = Number(parts[i + 1]);

				if (!isNaN(sols))
					this.state = {...this.state, sols};

				// `x Sols/s`
				sols = Number(parts[i - 1]);

				if (!isNaN(sols))
					this.state = {...this.state, sols};
			}
		});

		if (parts[parts.length - 1] === '+') {
			this.state = {
				...this.state,
				shares: this.state.shares + 1
			};
		}

		if (parts.indexOf('accepted') > -1 && parts.indexOf('share') > -1) {
			this.state = {
				...this.state,
				shares: this.state.shares + 1
			};
		}
	}
}

module.exports = Parser;
