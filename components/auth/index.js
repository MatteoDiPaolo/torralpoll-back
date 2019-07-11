const System = require('systemic');
const initAuth = require('./auth');

module.exports = new System({ name: 'auth' })
	.add('auth', initAuth())
	.dependsOn('config');
