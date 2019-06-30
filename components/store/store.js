const mongoose = require('mongoose');
const Poll = require('./models/poll');
const { formatPollDetails, formatPollsList } = require('./formatters/poll');

module.exports = () => {
	const start = async ({ logger, config }) => {
		// DB connection method
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

		const details = async pollId => {
			try {
				const pollFromDB = await Poll.findOne({ _id: pollId });
				const pollFormatted = formatPollDetails(pollFromDB);
				return pollFormatted;
			} catch (err) {
				logger.error(err);
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
				const pollsListFromDB = await Poll.find({ });
				const pollsListFormatted = formatPollsList(pollsListFromDB);
				return pollsListFormatted;
			} catch (err) {
				logger.error(err);
				return undefined;
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
