const util = require('util');
const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

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

module.exports = {
	errorFactory,
	httpErrorFactory,
	handleError,
};
