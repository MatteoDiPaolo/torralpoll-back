const System = require('systemic');
const { join } = require('path');

module.exports = () =>
	new System({ name: 'torralpoll-back' })
		.bootstrap(join(__dirname, 'components'));

