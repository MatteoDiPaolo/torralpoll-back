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

		app.post('/:id/close', (req, res, next) => {
			const { id } = req.params;
			return controller
				.close(id)
				.then(response => res.json(response))
				.catch(next);
		});

		app.get('/:id/details', (req, res, next) => {
			const { id } = req.params;
			return controller
				.details(id)
				.then(response => res.json(response))
				.catch(next);
		});

		app.post('/:id/vote', (req, res, next) => {
			const { id } = req.params;
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
