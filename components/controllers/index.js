const System = require('systemic');
const initPoll = require('./poll');
const initCategory = require('./category');

module.exports = new System({ name: 'controller' })
	.add('controller.poll', initPoll())
	.dependsOn('logger', {
		component: 'store.poll',
		destination: 'store',
	})
	.add('controller.category', initCategory())
	.dependsOn('logger', 'config');
