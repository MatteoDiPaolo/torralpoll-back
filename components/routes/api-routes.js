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


		app.get('/list', cors(), async (req, res, next) => {
			try {
				const pollsList = await controller.listAll();
				return res.json(pollsList);
			} catch (err) {
				return next(tagError(err));
			}
		});


		app.post('/create', cors(), async (req, res, next) => {
			try {
				const { name, description, options } = req.body;
				const newPoll = await controller.create(name, description, options);
				return res.json(newPoll);
			} catch (err) {
				return next(tagError(err));
			}
		});


		app.get('/:id/details', cors(), async (req, res, next) => {
			try {
				const { id } = req.params;
				const pollDetails = await controller.details(id);
				return res.json(pollDetails);
			} catch (err) {
				return next(tagError(err));
			}
		});


		app.post('/:id/vote', cors(), async (req, res, next) => {
			try {
				const { id } = req.params;
				const { user, option } = req.body;
				const pollUpdated = await controller.vote(id, user, option);
				return res.json(pollUpdated);
			} catch (err) {
				return next(tagError(err));
			}
		});


		app.post('/:id/close', cors(), async (req, res, next) => {
			try {
				const { id } = req.params;
				const pollClosed = await controller.close(id);
				return res.json(pollClosed);
			} catch (err) {
				return next(tagError(err));
			}
		});


		app.post('/:id/delete', cors(), async (req, res, next) => {
			try {
				const { id } = req.params;
				const pollDeleted = await controller.deleteById(id);
				return res.json(pollDeleted);
			} catch (err) {
				return next(tagError(err));
			}
		});


		app.use(handleError(logger));
	};

	return { start };
};
