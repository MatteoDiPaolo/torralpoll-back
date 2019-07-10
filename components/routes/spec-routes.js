
/**
 * @typedef UsersMeResponse
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
 * @property {string} exp
 * @property {string} typ
 * @property {string} rol
 */

/**
 * @typedef User
 * @property {string} name
 * @property {string} given_name
 * @property {string} family_name
 * @property {string} email
 * @property {string} picture
 * @property {string} rol
 */

/**
 * @typedef PollCreateRequest
 * @property {string} name
 * @property {string} description
 * @property {Array.<string>} options
 */

/**
 * @typedef PollCreateResponse
 * @property {string} id
 */

/**
 * @typedef PollPollsList
 * @property {string} id
 * @property {string} timestampCreation
 * @property {string} name
 * @property {string} description
 * @property {boolean} active
 * @property {string} userHasVoted
 * @property {User.model} createdBy
 */

/**
 * @typedef PollsListResponse
 * @property {Array.<PollPollsList>} polls
 */

/**
 * @typedef PollVoteRequest
 * @property {string} option
 */

/**
 * @typedef PollVoteResponse
 * @property {string} id
 */

/**
 * @typedef PollUserResponseOption
 * @property {number} votesCount
 * @property {string} name
 */

/**
 * @typedef PollAdminResponseOption
 * @property {Array.<User>} votes
 * @property {number} votesCount
 * @property {string} name
 */

/**
 * @typedef PollUserResponse
 * @property {string} id
 * @property {string} timestampCreation
 * @property {string} name
 * @property {string} description
 * @property {boolean} active
 * @property {Array.<PollUserResponseOption>} options
 * @property {string} votedOption
 * @property {User.model} createdBy
 */

/**
 * @typedef PollAdminResponse
 * @property {string} id
 * @property {string} timestampCreation
 * @property {string} name
 * @property {string} description
 * @property {boolean} active
 * @property {Array.<PollAdminResponseOption>} options
 * @property {string} votedOption
 * @property {User.model} createdBy
 */

/**
 * @typedef PollCloseResponse
 * @property {string} id
 */

/**
 * @typedef PollDeleteResponse
 * @property {string} id
 */

/**
 * @typedef Error401
 * @property {number} statusCode - statusCode - eg: 401
 * @property {string} error
 */

/**
 * @typedef Error403
 * @property {number} statusCode - statusCode - eg: 403
 * @property {string} error
 */

/**
 * @typedef Error404
 * @property {number} statusCode - statusCode - eg: 404
 * @property {string} error
 */

/**
 * @typedef ErrorServer
 * @property {number} statusCode - statusCode - eg: 500
 * @property {string} error
 */

