

const ADMINS_EMAILS = [
	'matteo.dipaolantonio@guidesmiths.com', 'lucas.jin@guidesmiths.com',
];
const USERS_EMAILS = [
	'matteo.del.passo89@gmail.com', 'lucas1004jx@gmail.com',
	'daniel.alarcon@guidesmiths.com', 'pablo.albaladejo@guidesmiths.com',
	'daniel.colas@guidesmiths.com', 'javier.arriero@guidesmiths.com',
	'ismael.bakkali@guidesmiths.com', 'david.diez@guidesmiths.com',
	'michael.beattie@guidesmiths.com', 'javier.bergantinos@guidesmiths.com',
	'guillermo.c.martinez@guidesmiths.com', 'joseantonio.dorado@guidesmiths.com',
	'nuria.extremadouro@guidesmiths.com', 'alberto.fernandez@guidesmiths.com',
	'carlos.garcia@guidesmiths.com', 'raquel.fernandez@guidesmiths.com',
	'garazi.gartzia@guidesmiths.com', 'jose.gonzalez@guidesmiths.com',
	'giorgio.grassini@guidesmiths.com', 'daniel.herrero@guidesmiths.com',
	'carlos.jimenez@guidesmiths.com', 'diego.manilla@guidesmiths.com',
	'javier.manzano@guidesmiths.com', 'inigo.marquinez@guidesmiths.com',
	'kevin.martinez@guidesmiths.com', 'iria.mavji@guidesmiths.com',
	'mike.morley@guidesmiths.com', 'mike.newall@guidesmiths.com',
	'glenn.ogrady@guidesmiths.com', 'jm.torralvo@guidesmiths.com',
	'diego.perez@guidesmiths.com', 'victor.perez@guidesmiths.com',
	'felipe.polo@guidesmiths.com', 'mario.quiroga@guidesmiths.com',
	'ruben.romero@guidesmiths.com', 'carlos.serrano@guidesmiths.com',
	'ulises.gascon@guidesmiths.com', 'laura.corbi@guidesmiths.com',
	'lucas1004jx@gmail.com', 'rafael.delatorre@guidesmiths.com',
	'amelia.perales@guidesmiths.com', 'deicola.moreno@guidesmiths.com',
	'roberto.hernandez@guidesmiths.com', 'david.yusta@guidesmiths.com',
	'alejandra.castro@guidesmiths.com', 'gabriel.pfeffer@guidesmiths.com',
	'ramon.morcillo@guidesmiths.com', 'farivar.parand@guidesmiths.com',
	'alejandro.sanchez@guidesmiths.com', 'ignacio.ripoli@guidesmiths.com',
	'jennifer.goijman@guidesmiths.com', 'daniel.eguiluz@guidesmiths.com',
];

const POLL_CATEGORIES = [
	'restaurant',
	'afterwork',
	'knowledge sharing',
	'business decision',
	'other',
];


module.exports = {
	server: {
		host: '0.0.0.0',
		port: process.env.PORT || 4000,
	},
	store: {
		mongodbConnectionString: process.env.MONGODB_CONNECTION_STRING,
	},
	controller: {
		category: {
			list: POLL_CATEGORIES,
		},
		poll: {
			categories: POLL_CATEGORIES,
		},
	},
	auth: {
		googleClientIds: [process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_ID_MA],
		adminsEmails: ADMINS_EMAILS,
		usersEmails: USERS_EMAILS,
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
