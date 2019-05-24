const { handleError } = require('../../lib/error');

const bodyParser = require('body-parser');

module.exports = () => {
	const start = async ({ app, logger, controller }) => {
		app.use(bodyParser.json());

		app.post('/create', (req, res, next) => {
			const { options } = req.body;
			return controller
				.create(options)
				.then(response => res.json(response))
				.catch(next);
		});

		app.post('/close', (req, res, next) => {
			const { id } = req.query;
			return controller
				.close(id)
				.then(response => res.json(response))
				.catch(next);
		});

		app.get('/details', (req, res, next) => {
			const { id } = req.query;
			return controller
				.details(id)
				.then(response => res.json(response))
				.catch(next);
		});

		app.post('/vote', (req, res, next) => {
			const { id } = req.query;
			const { user, option } = req.body;
			return controller
				.vote(id, user, option)
				.then(response => res.json(response))
				.catch(next);
		});

		app.use(handleError(logger));
	};

	return { start };
};
