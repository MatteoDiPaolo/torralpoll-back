const cors = require('cors');
const bodyParser = require('body-parser');
const request = require('request-promise-native');

const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } = require('http-status-codes');
const { handleError, httpErrorFactory, errorFactory } = require('../../lib/errors');

const unauthorizedError = errorFactory('unauthorized');

const buildBadRequestError = httpErrorFactory(BAD_REQUEST);
const buildNotFoundError = httpErrorFactory(NOT_FOUND);
const buildUnauthorisedError = httpErrorFactory(UNAUTHORIZED);
const buildServerError = httpErrorFactory();

module.exports = () => {
	const start = async ({ app, logger, controller, config }) => {
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


		const requests = {
			get: uri => ({
				uri,
				method: 'GET',
				json: true,
			}),
		};
		const isTokenValidForGoogle = tok =>
			request(requests.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${tok}`))
				.then(data => data)
				.catch(err => err);

		/**
		 * This endpoint will give you the info of the user retrieved from google using the token
		 * @route POST /user
		 * @group Users - Everything about users
		 * @param {Token.model} token.body.required - google token
		 * @returns {UserAuthentication.model} 200 - Success response
		 * @returns {Error401.model} 401 - Unauthorized
		 * @returns {ErrorServer.model} 500 - Server Error
		 */
		app.post('/user', cors(), async (req, res, next) => {
			try {
				const { token } = req.body;
				const resFromGoogle = await isTokenValidForGoogle(token);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The provided token is not valid');
				return res.json({
					iss: resFromGoogle.iss,
					hd: resFromGoogle.hd,
					email: resFromGoogle.email,
					email_verified: resFromGoogle.email_verified,
					name: resFromGoogle.name,
					picture: resFromGoogle.picture,
					given_name: resFromGoogle.given_name,
					family_name: resFromGoogle.family_name,
					locale: resFromGoogle.locale,
					iat: resFromGoogle.iat,
					exp: resFromGoogle.exp,
					typ: resFromGoogle.typ,
					rol: ['matteo.dipaolantonio@guidesmiths.com', 'lucas.jin@guidesmiths.com'].includes(resFromGoogle.email) ? 'Admin' : 'User',
				});
			} catch (err) {
				return next(tagError(err));
			}
		});

		/**
		 * This endpoint will give you a list of each poll stored into the DB
		 * @route GET /list
		 * @group Polls - Everything about polls
		 * @returns {PollsList.model} 200 - Success response
		 * @returns {Error401.model} 401 - Unauthorized
		 * @returns {ErrorServer.model} 500 - Server Error
		 * @security JWT
		 */
		app.get('/list', cors(), async (req, res, next) => {
			try {
				const resFromGoogle = await isTokenValidForGoogle(req.headers.authorization);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The user is not authenticated');
				const pollsList = await controller.listAll();
				return res.json(pollsList);
			} catch (err) {
				return next(tagError(err));
			}
		});

		/**
		 * This endpoint will create a new poll
		 * @route POST /create
		 * @group Polls - Everything about polls
		 * @param {NewPoll.model} newPoll.body.required - new poll info
		 * @returns {Poll.model} 200 - Success response
		 * @returns {Error401.model} 401 - Unauthorized
		 * @returns {ErrorServer.model} 500 - Server Error
		 * @security JWT
		 */
		app.post('/create', cors(), async (req, res, next) => {
			try {
				const resFromGoogle = await isTokenValidForGoogle(req.headers.authorization);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The user is not authenticated');
				if (!['matteo.dipaolantonio@guidesmiths.com', 'lucas.jin@guidesmiths.com'].includes(resFromGoogle.email)) throw unauthorizedError('The user is not authorized');
				const { name, description, options } = req.body;
				const newPoll = await controller.create(name, description, options);
				return res.json(newPoll);
			} catch (err) {
				return next(tagError(err));
			}
		});

		/**
		 * This endpoint will give you all the info related to a poll
		 * @route GET /{id}/details
		 * @group Polls - Everything about polls
		 * @param {string} id.path.required - poll id
		 * @returns {Poll.model} 200 - Success response
		 * @returns {Error401.model} 401 - Unauthorized
		 * @returns {Error404.model} 404 - Not found
		 * @returns {ErrorServer.model} 500 - Server Error
		 * @security JWT
		 */
		app.get('/:id/details', cors(), async (req, res, next) => {
			try {
				const resFromGoogle = await isTokenValidForGoogle(req.headers.authorization);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The user is not authenticated');
				const { id } = req.params;
				const user = resFromGoogle.email;
				const pollDetails = await controller.details(id, user);
				return res.json(pollDetails);
			} catch (err) {
				return next(tagError(err));
			}
		});
		app.get('/:id/userOption', cors(), async (req, res, next) => {
			try {
				const resFromGoogle = await isTokenValidForGoogle(req.headers.authorization);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The user is not authenticated');
				const { id } = req.params;
				const user = resFromGoogle.email;
				const userOption = await controller.userOption(id, user);
				return res.json(userOption);
			} catch (err) {
				return next(tagError(err));
			}
		});
		app.get('/:id/result', cors(), async (req, res, next) => {
			try {
				const resFromGoogle = await isTokenValidForGoogle(req.headers.authorization);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The user is not authenticated');
				const { id } = req.params;
				const pollResult = await controller.pollResult(id);
				return res.json(pollResult);
			} catch (err) {
				return next(tagError(err));
			}
		});
		/**
		 * This endpoint will let you vote for a given poll
		 * @route POST /{id}/vote
		 * @group Polls - Everything about polls
		 * @param {string} id.path.required - poll id
		 * @param {UserVote.model} userVote.body.required - user vote
		 * @returns {Poll.model} 200 - Success response
		 * @returns {Error401.model} 401 - Unauthorized
		 * @returns {Error404.model} 404 - Not found
		 * @returns {ErrorServer.model} 500 - Server Error
		 * @security JWT
		 */
		app.post('/:id/vote', cors(), async (req, res, next) => {
			try {
				const resFromGoogle = await isTokenValidForGoogle(req.headers.authorization);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The user is not authenticated');
				const { id } = req.params;
				const { user, option } = req.body;
				const pollUpdated = await controller.vote(id, user, option);
				return res.json(pollUpdated);
			} catch (err) {
				return next(tagError(err));
			}
		});

		/**
		 * This endpoint will let you close a given poll
		 * @route POST /{id}/close
		 * @group Polls - Everything about polls
		 * @param {string} id.path.required - poll id
		 * @returns {Poll.model} 200 - Success response
		 * @returns {Error401.model} 401 - Unauthorized
		 * @returns {Error404.model} 404 - Not found
		 * @returns {ErrorServer.model} 500 - Server Error
		 * @security JWT
		 */
		app.post('/:id/close', cors(), async (req, res, next) => {
			try {
				const resFromGoogle = await isTokenValidForGoogle(req.headers.authorization);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The user is not authenticated');
				if (!['matteo.dipaolantonio@guidesmiths.com', 'lucas.jin@guidesmiths.com'].includes(resFromGoogle.email)) throw unauthorizedError('The user is not authorized');
				const { id } = req.params;
				const pollClosed = await controller.close(id);
				return res.json(pollClosed);
			} catch (err) {
				return next(tagError(err));
			}
		});

		/**
		 * This endpoint will let you delete a given poll
		 * @route DELETE /{id}/delete
		 * @group Polls - Everything about polls
		 * @param {string} id.path.required - poll id
		 * @returns {Poll.model} 200 - Success response
		 * @returns {Error401.model} 401 - Unauthorized
		 * @returns {Error404.model} 404 - Not found
		 * @returns {ErrorServer.model} 500 - Server Error
		 * @security JWT
		 */
		app.delete('/:id/delete', cors(), async (req, res, next) => {
			try {
				const resFromGoogle = await isTokenValidForGoogle(req.headers.authorization);
				if (resFromGoogle.aud !== config.googleClientId) throw unauthorizedError('The user is not authenticated');
				if (!['matteo.dipaolantonio@guidesmiths.com', 'lucas.jin@guidesmiths.com'].includes(resFromGoogle.email)) throw unauthorizedError('The user is not authorized');
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
