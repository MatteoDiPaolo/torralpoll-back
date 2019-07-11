

const userHasAlreadyVoted = (user, pollFromDB) => {
	for (let i = 0; i < pollFromDB.options.length; i += 1) {
		for (let j = 0; j < pollFromDB.options[i].votes.length; j += 1) {
			if (user.email === pollFromDB.options[i].votes[j].email) {
				return true;
			}
		}
	}
	return false;
};

const optionDoesExists = (option, pollFromDB) => {
	for (let i = 0; i < pollFromDB.options.length; i += 1) {
		if (option === pollFromDB.options[i].name) {
			return true;
		}
	}
	return false;
};

const getVotedOption = (user, pollFromDB) => {
	for (let i = 0; i < pollFromDB.options.length; i += 1) {
		for (let j = 0; j < pollFromDB.options[i].votes.length; j += 1) {
			if (user.email === pollFromDB.options[i].votes[j].email) {
				return pollFromDB.options[i].name;
			}
		}
	}
	return null;
};


const newPollHasDuplicatedOptions = options => options.some((name, index) => options.indexOf(name) !== index);

module.exports = {
	userHasAlreadyVoted,
	optionDoesExists,
	getVotedOption,
	newPollHasDuplicatedOptions,
};
