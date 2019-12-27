const { UNAUTHORIZED, FORBIDDEN } = require('http-status-codes');
const request = require('request-promise-native');
const { httpErrorFactory } = require('../../lib/errors');
const { formatUserFromGoogleToken } = require('./formatters/userFromGoogleToken');

const buildUnauthorisedError = httpErrorFactory(UNAUTHORIZED);
const buildForbiddenError = httpErrorFactory(FORBIDDEN);


module.exports = () => {
	const start = async ({ config, store }) => {
		const requests = {
			get: uri => ({
				uri,
				method: 'GET',
				json: true,
			}),
		};
		const isTokenValidForGoogle = token =>
			request(requests.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`))
				.then(data => data)
				.catch(err => err);


		const authenticate = async (req, res, next) => {
			try {
				const token = req.headers.authorization;
				if (!token) throw new Error('Missing token');
				const payloadFromGoogle = await isTokenValidForGoogle(token);
				if (payloadFromGoogle.aud !== config.googleClientId) throw new Error('Invalid token');
				res.locals.userFromGoogleToken = formatUserFromGoogleToken(payloadFromGoogle, config);
				return next();
			} catch (error) {
				return next(buildUnauthorisedError(`Authentication failed: ${error.message}`));
			}
		};


		const authorise = operation => attribute => allowedList => async (req, res, next) => {
			try {
				const { userFromGoogleToken } = res.locals;
				if (['close', 'delete'].includes(operation)) {
					const { id } = req.params;
					const creator = await store.creator(id);
					if (userFromGoogleToken.email === creator.email) {
						userFromGoogleToken.rol = 'Creator';
					}
				}
				if (!allowedList.includes(userFromGoogleToken[attribute])) throw new Error(`${attribute} not valid`);
				return next();
			} catch (error) {
				return next(buildForbiddenError(`User not authorised to perform this operation: ${error.message}`));
			}
		};

		return {
			authenticate,
			authorise,
		};
	};

	return { start };
};
