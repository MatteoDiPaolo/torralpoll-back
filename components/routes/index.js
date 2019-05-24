const System = require('systemic');
const adminRoutes = require('./admin-routes');
const mainRoutes = require('./main-routes');

module.exports = new System({ name: 'routes' })
	.add('routes.admin', adminRoutes())
	.dependsOn('config', 'logger', 'app', 'middleware.prepper', 'manifest')
	.add('routes.main', mainRoutes())
	.dependsOn('app', 'logger', 'controller')
	.add('routes')
	.dependsOn('routes.admin', 'routes.main');
