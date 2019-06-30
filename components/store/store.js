const mongoose = require('mongoose');
const Poll = require('./models/poll');

module.exports = () => {
	const start = async ({ logger, config }) => {
		const mongooseConnect = async () => {
			try {
				await mongoose.connect(config.mongodbConnectionString, { useNewUrlParser: true });
			} catch (error) {
				logger.error(error.message);
				throw error;
			}
		};
		await mongooseConnect();


		const create = async (name, description, options) => {
			const poll = {
				name,
				description,
				active: true,
				options: options.map(op => ({ name: op, votes: [] })),
			};
			try {
				const res = await new Poll(poll).save();

				return res._id;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const updateVotes = async (pollId, user, option) => {
			try {
				const poll = await Poll.findOne({ _id: pollId });
				if (!poll.active) throw new Error('Poll Inactive');
				poll.options.forEach(op => {
					if (op.votes.indexOf(user) !== -1) {
						throw new Error('Already voted');
					}
				});
				await Poll.findOneAndUpdate({
					_id: pollId,
					'options.name': option,
				}, {
					$push: { 'options.$.votes': user },
				});
				return {};
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};

		const formatPoll = pollFromDB => (
			{
				_id: pollFromDB._id,
				name: pollFromDB.name,
				description: pollFromDB.description,
				active: pollFromDB.active,
				options: pollFromDB.options.map(op => ({ votes: op.votes, name: op.name })),
			});

		const details = async pollId => {
			try {
				const pollFromDB = await Poll.findOne({ _id: pollId });
				const pollFormatted = await formatPoll(pollFromDB);
				return pollFormatted;
			} catch (error) {
				return undefined;
			}
		};


		const close = async pollId => {
			try {
				const poll = await Poll.findOne({ _id: pollId });
				if (!poll.active) throw new Error('Poll already Inactive');
				console.log('closing');
				await Poll.findOneAndUpdate({
					_id: pollId,
				}, {
					active: false,
				});
				return {};
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};

		const listAll = async () => {
			try {
				const polls = await Poll.find({ });
				return {
					polls: polls.map(p => ({
						_id: p._id,
						name: p.name,
						description: p.description,
						active: p.active,
						options: p.options.map(op => ({ votes: op.votes, name: op.name })),
					})),
				};
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const deleteById = async pollId => {
			try {
				const poll = await Poll.findByIdAndRemove({ _id: pollId });
				return poll._id;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};

		return {
			create,
			updateVotes,
			details,
			close,
			listAll,
			deleteById,
		};
	};

	return {
		start,
	};
};
