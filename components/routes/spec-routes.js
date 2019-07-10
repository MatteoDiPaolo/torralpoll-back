

/**
 * @typedef PollCompact
 * @property {string} _id
 * @property {string} name
 * @property {boolean} active
 * @property {string} hasVoted
 */

/**
 * @typedef PollsList
 * @property {Array.<PollCompact>} polls
 */

/**
 * @typedef Options
 * @property {Array.<string>} votes
 * @property {string} name
 */

/**
 * @typedef Poll
 * @property {string} _id
 * @property {string} name
 * @property {boolean} active
 * @property {Array.<Options>} options
 */

/**
 * @typedef NewPoll
 * @property {string} name
 * @property {string} description
 * @property {Array.<string>} options
 */

/**
 * @typedef UserVote
 * @property {string} option
 */

/**
 * @typedef Token
 * @property {string} token
 */

/**
 * @typedef UserAuthentication
 * @property {string} iss
 * @property {string} hd
 * @property {string} email
 * @property {string} email_verified
 * @property {string} name
 * @property {string} picture
 * @property {string} given_name
 * @property {string} family_name
 * @property {string} locale
 * @property {string} iat
 * @property {string} exp - expiration time
 * @property {string} typ - type JWT
 * @property {string} role - admin, user
 */

/**
 * @typedef ErrorServer
 * @property {number} statusCode - statusCode - eg: 500
 * @property {string} error
 */

/**
 * @typedef Error404
 * @property {number} statusCode - statusCode - eg: 404
 * @property {string} error
 */

/**
 * @typedef Error401
 * @property {number} statusCode - statusCode - eg: 401
 * @property {string} error
 */

