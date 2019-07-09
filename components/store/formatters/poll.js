

const formatPollDetails = pollFromDB => (
	{
		_id: pollFromDB._id,
		name: pollFromDB.name,
		description: pollFromDB.description,
		active: pollFromDB.active,
		options: pollFromDB.options.map(opt => ({ name: opt.name })),
	}
);

const formatPollOption = (pollFromDB, user) => (
	{
		_id: pollFromDB._id,
		name: pollFromDB.name,
		description: pollFromDB.description,
		options: pollFromDB.options.map(opt => ({ name: opt.name })),
		userOption: pollFromDB.options.filter(option => option.votes.includes(user))[0].name,
	}
);
const formatPollResult = pollFromDB => (
	{
		_id: pollFromDB._id,
		name: pollFromDB.name,
		description: pollFromDB.description,
		options: pollFromDB.options.map(opt => ({ name: opt.name, votes: opt.votes.length })),
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
	formatPollOption,
	formatPollResult,
};
