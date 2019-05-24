const System = require('systemic');
const store = require('./store');

module.exports = new System({ name: 'store' })
	.add('store', store())
	.dependsOn('logger', 'config');
