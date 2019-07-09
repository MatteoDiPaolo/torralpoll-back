/* eslint-disable no-plusplus */


const userHasAlreadayVoted = (user, poll) => poll.options.reduce((_, opt) => _ || opt.votes.includes(user), false);


module.exports = {
	userHasAlreadayVoted,
};
