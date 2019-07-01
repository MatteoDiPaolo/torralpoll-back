
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
 * @typedef PollsList
 * @property {Array.<Poll>} polls
 */

/**
 * @typedef NewPoll
 * @property {string} name
 * @property {Array.<string>} options
 */

/**
 * @typedef UserVote
 * @property {string} user
 * @property {string} option
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

