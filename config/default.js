module.exports = {
	server: {
		host: '0.0.0.0',
		port: process.env.PORT || 4000,
	},
	store: {
		mongodbConnectionString: process.env.MONGODB_CONNECTION_STRING,
	},
	auth: {
		googleClientId: process.env.GOOGLE_CLIENT_ID,
		adminsEmails: ['matteo.dipaolantonio@guidesmiths.com', 'lucas.jin@guidesmiths.com'],
		usersEmails: [],
		adminRol: 'Admin',
		userRol: 'User',
	},
	routes: {
		admin: {
			swaggerOptions: {
				swaggerDefinition: {
					info: {
						description: 'Documentation for TorralPoll Back API',
						title: 'TorralPoll Back API',
						version: '1.0.0',
						contact: { email: 'matteo.dipaolantonio@guidesmiths.com' },
					},
					host: process.env.HOST || `localhost:${process.env.PORT || 4000}`,
					basePath: '/',
					produces: ['application/json'],
					schemes: ['https', 'http'],
					securityDefinitions: {
						JWT: {
							type: 'apiKey',
							in: 'header',
							name: 'Authorization',
							description: '',
						},
					},
				},
			},
		},
	},
	logger: {
		transport: 'console',
		include: [
			'tracer',
			'timestamp',
			'level',
			'message',
			'error.message',
			'error.code',
			'error.stack',
			'request.url',
			'request.headers',
			'request.params',
			'request.method',
			'response.statusCode',
			'response.headers',
			'response.time',
			'process',
			'system',
			'package.name',
			'service',
		],
		exclude: ['password', 'secret', 'token', 'request.headers.cookie', 'dependencies', 'devDependencies'],
	},
};
