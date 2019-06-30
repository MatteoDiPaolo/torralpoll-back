

const formatPollDetails = pollFromDB => (
	{
		_id: pollFromDB._id,
		name: pollFromDB.name,
		description: pollFromDB.description,
		active: pollFromDB.active,
		options: pollFromDB.options.map(op => ({ votes: op.votes, name: op.name })),
	});


module.exports = {
	formatPollDetails,
};
