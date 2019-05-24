const util = require('util');
const { BAD_REQUEST, NOT_FOUND } = require('http-status-codes');

function InputError(message, extra) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
	this.extra = extra;
}

function NotFoundError(message, extra) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
	this.extra = extra;
}

util.inherits(InputError, Error);
util.inherits(NotFoundError, Error);

const tagError = err => {
	const errors = {
		InputError: BAD_REQUEST,
		NotFoundError: NOT_FOUND,
	};

	return errors[err.name];
};

const handleError = logger => (err, req, res) => {
	const newErr = { ...err, statusCode: tagError(err) };
	logger.error(`${newErr.message} - ${newErr.stack}`);
	res.status(newErr.statusCode || 500).json({ type: newErr.name, message: newErr.message, extra: newErr.extra });
};

module.exports = {
	InputError,
	NotFoundError,
	handleError,
};
