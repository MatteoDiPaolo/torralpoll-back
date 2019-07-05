/* eslint-disable no-plusplus */


const userHasAlreadayVoted = (user, poll) => {
	let alreadyVoted = false;
	for (let i = 0; i < poll.options.length; i++) {
		for (let j = 0; j < poll.options[i].votes.length; j++) {
			if (user === poll.options[i].votes[j]) {
				alreadyVoted = true;
			}
		}
	}
	return alreadyVoted;
};

module.exports = {
	userHasAlreadayVoted,
};
