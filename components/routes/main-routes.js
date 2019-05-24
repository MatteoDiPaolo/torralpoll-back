const { handleError } = require('../../lib/error');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = () => {
	const start = async ({ app, logger, controller }) => {
		app.use(bodyParser.json());
		app.use(cors());
		app.all('*', (req, res, next) => {
			const origin = req.get('origin');
			res.header('Access-Control-Allow-Origin', origin);
			res.header('Access-Control-Allow-Headers', 'X-Requested-With');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});

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
