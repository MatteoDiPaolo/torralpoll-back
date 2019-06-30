

const formatPollDetails = pollFromDB => (
	{
		_id: pollFromDB._id,
		name: pollFromDB.name,
		description: pollFromDB.description,
		active: pollFromDB.active,
		options: pollFromDB.options.map(op => ({ votes: op.votes, name: op.name })),
	}
);

const formatPollsList = pollsListFromDB => (
	{
		polls: pollsListFromDB.map(pollFromDB => ({
			_id: pollFromDB._id,
			name: pollFromDB.name,
			description: pollFromDB.description,
			active: pollFromDB.active,
			options: pollFromDB.options.map(option => ({ votes: option.votes, name: option.name })),
		})),
	}
);

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
