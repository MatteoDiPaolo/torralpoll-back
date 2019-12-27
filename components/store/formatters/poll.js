const { userHasAlreadyVoted, getVotedOption } = require('../utils/helpers');

const formatUserFromDB = userFromDB => ({
	name: userFromDB.name,
	given_name: userFromDB.given_name,
	family_name: userFromDB.family_name,
	email: userFromDB.email,
	picture: userFromDB.picture,
	rol: userFromDB.rol,
});

const formatNewPollToDB = (timestampCreation, name, description, options, category, user) => ({
	timestampCreation,
	name,
	description,
	category,
	active: true,
	createdBy: user,
	options: options.map(option => ({ name: option, votes: [] })),
});

const formatPollCreateFromDB = pollFromDB => ({
	id: pollFromDB._id,
});

const formatPollCreatorFromDB = pollFromDB => formatUserFromDB(pollFromDB.createdBy);

const formatPollsListFromDB = (pollsListFromDB, user) => ({
	polls: pollsListFromDB.map(pollFromDB => ({
		id: pollFromDB._id,
		timestampCreation: pollFromDB.timestampCreation,
		name: pollFromDB.name,
		description: pollFromDB.description,
		category: pollFromDB.category,
		active: pollFromDB.active,
		userHasVoted: userHasAlreadyVoted(user, pollFromDB),
		createdBy: formatUserFromDB(pollFromDB.createdBy),
		participants: pollFromDB.options.reduce((total, option) => total + option.votes.length, 0),
	})),
});

const formatPollDetailsFromDB = (pollFromDB, user) => {
	if (user.email === pollFromDB.createdBy.email || user.rol === 'Admin') {
		return {
			id: pollFromDB._id,
			timestampCreation: pollFromDB.timestampCreation,
			name: pollFromDB.name,
			description: pollFromDB.description,
			category: pollFromDB.category,
			active: pollFromDB.active,
			options: pollFromDB.options.map(op => ({
				votes: op.votes.map(vote => formatUserFromDB(vote)),
				votesCount: op.votes.length,
				name: op.name,
			})),
			votedOption: getVotedOption(user, pollFromDB),
			createdBy: formatUserFromDB(pollFromDB.createdBy),
		};
	} else if (user.rol === 'User') {
		return {
			id: pollFromDB._id,
			timestampCreation: pollFromDB.timestampCreation,
			name: pollFromDB.name,
			description: pollFromDB.description,
			category: pollFromDB.category,
			active: pollFromDB.active,
			options: pollFromDB.options.map(op => ({ votesCount: op.votes.length, name: op.name })),
			votedOption: getVotedOption(user, pollFromDB),
			createdBy: formatUserFromDB(pollFromDB.createdBy),
		};
	}
	return {};
};


module.exports = {
	formatNewPollToDB,
	formatPollCreateFromDB,
	formatPollsListFromDB,
	formatPollDetailsFromDB,
	formatPollCreatorFromDB,
};
