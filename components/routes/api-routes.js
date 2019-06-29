const cors = require('cors');
const bodyParser = require('body-parser');
const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const { handleError, httpErrorFactory } = require('../../lib/errors');

const buildBadRequestError = httpErrorFactory(BAD_REQUEST);
const buildNotFoundError = httpErrorFactory(NOT_FOUND);
const buildUnauthorisedError = httpErrorFactory(UNAUTHORIZED);
const buildServerError = httpErrorFactory();

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


		const tagError = err => {
			const errors = {
				not_found: buildNotFoundError(err.message, err.extra),
				server_error: buildServerError(err.message, err.extra),
				unauthorized: buildUnauthorisedError(err.message, err.extra),
				wrong_input: buildBadRequestError(err.message, err.extra),
			};
			return errors[err.type || 'server_error'];
		};

		app.post('/create', cors(), (req, res, next) => {
			const { name, description, options } = req.body;
			return controller
				.create(name, description, options)
				.then(response => res.json(response))
				.catch(next);
		});

		app.post('/:id/close', cors(), (req, res, next) => {
			const { id } = req.params;
			return controller
				.close(id)
				.then(response => res.json(response))
				.catch(next);
		});

		app.get('/:id/details', cors(), async (req, res, next) => {
			const { id } = req.params;
			try {
				const pollDetails = await controller.details(id);
				return res.json(pollDetails);
			} catch (err) {
				return next(tagError(err));
			}
		});


		app.get('/list', cors(), (req, res, next) => controller
			.listAll()
			.then(response => res.json(response))
			.catch(next));

		app.post('/:id/vote', cors(), (req, res, next) => {
			const { id } = req.params;
			const { user, option } = req.body;
			return controller
				.vote(id, user, option)
				.then(response => res.json(response))
				.catch(next);
		});

		app.post('/:id/delete', cors(), (req, res, next) => {
			const { id } = req.params;
			return controller
				.deleteById(id)
				.then(response => res.json(response))
				.catch(next);
		});

		app.use(handleError(logger));
	};

	return { start };
};
