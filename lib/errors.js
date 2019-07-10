const util = require('util');
const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, FORBIDDEN, INTERNAL_SERVER_ERROR } = require('http-status-codes');

function CustomError(message, type) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
	this.type = type;
}

function CustomHTTPError(statusCode, message, extra) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
	this.extra = extra;
	this.statusCode = statusCode;
}

util.inherits(CustomError, Error);
util.inherits(CustomHTTPError, CustomError);

const handleError = logger => (err, req, res, next) => { // eslint-disable-line no-unused-vars
	logger.error(`${err.message} - ${err.stack}`);
	res.status(err.statusCode || INTERNAL_SERVER_ERROR).json({ message: err.message, extra: err.extra });
};

const errorFactory = type => message => new CustomError(message, type);

const httpErrorFactory = (statusCode = INTERNAL_SERVER_ERROR) => (message, extra) => new CustomHTTPError(statusCode, message, extra);

const buildBadRequestError = httpErrorFactory(BAD_REQUEST);
const buildNotFoundError = httpErrorFactory(NOT_FOUND);
const buildUnauthorisedError = httpErrorFactory(UNAUTHORIZED);
const buildForbiddenError = errorFactory(FORBIDDEN);
const buildServerError = httpErrorFactory();

const tagError = err => {
	const errors = {
		not_found: buildNotFoundError(err.message, err.extra),
		server_error: buildServerError(err.message, err.extra),
		unauthorized: buildUnauthorisedError(err.message, err.extra),
		forbidden: buildForbiddenError(err.message, err.extra),
		wrong_input: buildBadRequestError(err.message, err.extra),
	};
	return errors[err.type || 'server_error'];
};

module.exports = {
	errorFactory,
	httpErrorFactory,
	handleError,
	tagError,
};
