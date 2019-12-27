const System = require('systemic');
const poll = require('./poll');
const initStore = require('./store');

module.exports = new System({ name: 'store' })
	.add('store', initStore())
	.dependsOn('logger', 'config')
	.add('store.poll', poll())
	.dependsOn('logger', 'config');
