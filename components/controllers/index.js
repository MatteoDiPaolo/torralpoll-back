const System = require('systemic');
const initPoll = require('./poll');

module.exports = new System({ name: 'controller' })
	.add('controller', initPoll())
	.dependsOn('logger', 'store');
