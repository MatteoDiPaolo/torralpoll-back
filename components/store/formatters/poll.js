/* eslint-disable no-plusplus */


const formatPollDetails = (pollFromDB, userRole, user) => {
	const votedOption = () => {
		for (let i = 0; i < pollFromDB.options.length; i++) {
			if (pollFromDB.options[i].votes.includes(user)) {
				return pollFromDB.options[i].name;
			}
		}
		return null;
	};

	switch (userRole) {
	case 'Admin':
		return {
			_id: pollFromDB._id,
			name: pollFromDB.name,
			description: pollFromDB.description,
			active: pollFromDB.active,
			options: pollFromDB.options.map(op => ({ votes: op.votes, votesCount: op.votes.length, name: op.name })),
			votedOption: votedOption(pollFromDB),
			createdBy: user,
		};
	case 'User':
		return {
			_id: pollFromDB._id,
			name: pollFromDB.name,
			description: pollFromDB.description,
			active: pollFromDB.active,
			options: pollFromDB.options.map(op => ({ votesCount: op.votes.length, name: op.name })),
			votedOption: votedOption(pollFromDB),
			createdBy: user,
		};
	default:
		return {};
	}
};

const formatPollsList = (pollsListFromDB, user) => {
	const hasAlreadyVoted = pollFromDB => {
		for (let i = 0; i < pollFromDB.options.length; i++) {
			if (pollFromDB.options[i].votes.includes(user)) {
				return true;
			}
		}
		return false;
	};

	return {
		polls: pollsListFromDB.map(pollFromDB => ({
			_id: pollFromDB._id,
			name: pollFromDB.name,
			description: pollFromDB.description,
			active: pollFromDB.active,
			hasVoted: hasAlreadyVoted(pollFromDB),
		})),
	};
};

const formatNewPoll = (name, description, options) => (
	{
		name,
		description,
		active: true,
		options: options.map(option => ({ name: option, votes: [] })),
	}
);


module.exports = {
	formatPollsList,
	formatNewPoll,
	formatPollDetails,
};
