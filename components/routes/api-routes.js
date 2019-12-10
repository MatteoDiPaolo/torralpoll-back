const cors = require('cors');
const bodyParser = require('body-parser');

const { handleError, tagError } = require('../../lib/errors');


module.exports = () => {
	const start = async ({ app, logger, controller, auth }) => {
		app.use(bodyParser.json());
		app.use(cors());
		app.all('*', (req, res, next) => {
			const origin = req.get('origin');
			res.header('Access-Control-Allow-Origin', origin);
			res.header('Access-Control-Allow-Headers', 'X-Requested-With');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});

		const formatUserToOnlyUsefulProps = userFromGoogleToken => ({
			name: userFromGoogleToken.name,
			given_name: userFromGoogleToken.given_name,
			family_name: userFromGoogleToken.family_name,
			email: userFromGoogleToken.email,
			picture: userFromGoogleToken.picture,
			rol: userFromGoogleToken.rol,
		});


		/**
     * This endpoint will give you the info of the user retrieved from google using the token
     * @route GET /me
     * @group Users - Everything about users
     * @returns {UsersMeResponse.model} 200 - Success response
     * @returns {Error401.model} 401 - Unauthorized
     * @returns {ErrorServer.model} 500 - Server Error
     * @security JWT
     */
		app.get('/me', cors(), auth.authenticate, async (req, res, next) => {
			try {
				const { userFromGoogleToken } = res.locals;
				return res.json(userFromGoogleToken);
			} catch (err) {
				return next(tagError(err));
			}
		});


		/**
     * This endpoint will create a new poll
     * @route POST /create
     * @group Polls - Everything about polls
     * @param {PollCreateRequest.model} poll.body.required - new poll info
     * @returns {PollCreateResponse.model} 200 - Success response
     * @returns {Error401.model} 401 - Unauthorized
     * @returns {Error403.model} 403 - Forbidden
     * @returns {ErrorServer.model} 500 - Server Error
     * @security JWT
     */
		app.post('/create', cors(), auth.authenticate, auth.authorise('rol')(['Admin']), async (req, res, next) => {
			try {
				const { userFromGoogleToken } = res.locals;
				const user = formatUserToOnlyUsefulProps(userFromGoogleToken);
				const { name, description, options, category = '' } = req.body;
				const timestampCreation = new Date();
				const pollId = await controller.poll.create(timestampCreation, name, description, options, category, user);
				return res.json(pollId);
			} catch (err) {
				return next(tagError(err));
			}
		});


		/**
     * This endpoint will give you a list of each poll stored into the DB
     * @route GET /list
     * @group Polls - Everything about polls
     * @returns {PollsListResponse.model} 200  - Success response
     * @returns {Error401.model} 401 - Unauthorized
     * @returns {Error403.model} 403 - Forbidden
     * @returns {ErrorServer.model} 500 - Server Error
     * @security JWT
     */
		app.get('/list', cors(), auth.authenticate, auth.authorise('rol')(['User', 'Admin']), async (req, res, next) => {
			try {
				const { userFromGoogleToken } = res.locals;
				const user = formatUserToOnlyUsefulProps(userFromGoogleToken);
				const pollsList = await controller.poll.listAll(user);
				return res.json(pollsList);
			} catch (err) {
				return next(tagError(err));
			}
		});


		/**
     * This endpoint will let you vote for a given poll
     * @route POST /{id}/vote
     * @group Polls - Everything about polls
     * @param {string} id.path.required - poll id
     * @param {PollVoteRequest.model} option.body.required - user vote
     * @returns {PollVoteResponse.model} 200 - Success response
     * @returns {Error401.model} 401 - Unauthorized
     * @returns {Error403.model} 403 - Forbidden
     * @returns {Error404.model} 404 - Not found
     * @returns {ErrorServer.model} 500 - Server Error
     * @security JWT
     */
		app.post('/:id/vote', cors(), auth.authenticate, auth.authorise('rol')(['User', 'Admin']), async (req, res, next) => {
			try {
				const { userFromGoogleToken } = res.locals;
				const user = formatUserToOnlyUsefulProps(userFromGoogleToken);
				const { id } = req.params;
				const { option } = req.body;
				const pollId = await controller.poll.vote(id, option, user);
				return res.json(pollId);
			} catch (err) {
				return next(tagError(err));
			}
		});


		/**
     * This endpoint will give you all the info related to a poll
     * @route GET /{id}/details
     * @group Polls - Everything about polls
     * @param {string} id.path.required - poll id
     * @returns {PollAdminResponse.model} 200 (Admin) - Success response
     * @returns {PollUserResponse.model} 200 (User) - Success response
     * @returns {Error401.model} 401 - Unauthorized
     * @returns {Error403.model} 403 - Forbidden
     * @returns {Error404.model} 404 - Not found
     * @returns {ErrorServer.model} 500 - Server Error
     * @security JWT
     */
		app.get('/:id/details', cors(), auth.authenticate, auth.authorise('rol')(['User', 'Admin']), async (req, res, next) => {
			try {
				const { userFromGoogleToken } = res.locals;
				const user = formatUserToOnlyUsefulProps(userFromGoogleToken);
				const { id } = req.params;
				const pollDetails = await controller.poll.details(id, user);
				return res.json(pollDetails);
			} catch (err) {
				return next(tagError(err));
			}
		});


		/**
     * This endpoint will let you close a given poll
     * @route POST /{id}/close
     * @group Polls - Everything about polls
     * @param {string} id.path.required - poll id
     * @returns {PollCloseResponse.model} 200 - Success response
     * @returns {Error401.model} 401 - Unauthorized
     * @returns {Error403.model} 403 - Forbidden
     * @returns {Error404.model} 404 - Not found
     * @returns {ErrorServer.model} 500 - Server Error
     * @security JWT
     */
		app.post('/:id/close', cors(), auth.authenticate, auth.authorise('rol')(['Admin']), async (req, res, next) => {
			try {
				const { id } = req.params;
				const pollId = await controller.poll.close(id);
				return res.json(pollId);
			} catch (err) {
				return next(tagError(err));
			}
		});


		/**
     * This endpoint will let you delete a given poll
     * @route DELETE /{id}/delete
     * @group Polls - Everything about polls
     * @param {string} id.path.required - poll id
     * @returns {PollDeleteResponse.model} 200 - Success response
     * @returns {Error401.model} 401 - Unauthorized
     * @returns {Error403.model} 403 - Forbidden
     * @returns {Error404.model} 404 - Not found
     * @returns {ErrorServer.model} 500 - Server Error
     * @security JWT
     */
		app.delete('/:id/delete', cors(), auth.authenticate, auth.authorise('rol')(['Admin']), async (req, res, next) => {
			try {
				const { id } = req.params;
				const pollDeleted = await controller.poll.deleteById(id);
				return res.json(pollDeleted);
			} catch (err) {
				return next(tagError(err));
			}
		});

		app.put('/:id/update', cors(), auth.authenticate, auth.authorise('rol')(['Admin']), async (req, res, next) => {
			try {
				const { id, name, description, options, category = '' } = req.body;
				const timestampModified = new Date();
				const pollId = await controller.poll.updateById(id, timestampModified, name, description, options, category);
				return res.json(pollId);
			} catch (err) {
				return next(tagError(err));
			}
		});

		app.post('/createCategory', cors(), auth.authenticate, auth.authorise('rol')(['Admin']), async (req, res, next) => {
			try {
				const { name } = req.body;
				const category = await controller.category.create(name);
				return res.json(category);
			} catch (err) {
				return next(tagError(err));
			}
		});

		app.get('/categoryList', cors(), auth.authenticate, auth.authorise('rol')(['Admin']), async (req, res, next) => {
			try {
				const categories = await controller.category.listAll();
				return res.json(categories);
			} catch (err) {
				return next(tagError(err));
			}
		});

		app.use(handleError(logger));
	};

	return { start };
};
