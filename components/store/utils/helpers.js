

const userHasAlreadayVoted = (user, poll) => poll.options.reduce((hasAlreadyVoted, option) => hasAlreadyVoted.votes.indexOf(user) !== -1 || option.votes.indexOf(user) !== -1);

module.exports = {
	userHasAlreadayVoted,
};
