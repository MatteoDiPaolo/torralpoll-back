const expressSwaggerGenerator = require('express-swagger-generator');


module.exports = () => {
	const start = async ({ manifest = {}, app, config }) => {
		const { swaggerOptions } = config;
		const expressSwagger = expressSwaggerGenerator(app);
		const options = {
			swaggerDefinition: {
				...swaggerOptions.swaggerDefinition,
			},
			basedir: __dirname, // app absolute path
			files: ['./**/**-routes.js'], // Path to the API handle folder
		};
		expressSwagger(options);

		app.get('/__/manifest', (req, res) => res.json(manifest));
		return Promise.resolve();
	};

	return { start };
};
