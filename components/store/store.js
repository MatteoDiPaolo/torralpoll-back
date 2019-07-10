const mongoose = require('mongoose');
const Poll = require('./models/poll');
const { formatNewPoll, formatPollDetails, formatPollsList } = require('./formatters/poll');
const { userHasAlreadayVoted } = require('./utils/helpers');

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


		const listAll = async user => {
			try {
				const pollsListFromDB = await Poll.find({ });
				const pollsListFormatted = formatPollsList(pollsListFromDB, user);
				return pollsListFormatted;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const create = async (name, description, options, userRole, user) => {
			try {
				const newPoll = formatNewPoll(name, description, options);
				const newPollFromDB = await new Poll(newPoll).save();
				const pollFormatted = formatPollDetails(newPollFromDB, userRole, user);
				return pollFormatted;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const details = async (pollId, userRole, user) => {
			try {
				const pollFromDB = await Poll.findOne({ _id: pollId });
				if (!pollFromDB) throw new Error('poll_not_found');
				const pollFormatted = formatPollDetails(pollFromDB, userRole, user);
				return pollFormatted;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const updateVotes = async (pollId, user, option, userRole) => {
			try {
				const pollFromDB = await Poll.findOne({ _id: pollId });
				if (!pollFromDB) throw new Error('poll_not_found');
				if (!pollFromDB.active) throw new Error('poll_not_active');
				if (userHasAlreadayVoted(user, pollFromDB)) throw new Error('user_has_already_voted');
				await Poll.findOneAndUpdate(
					{ _id: pollId, 'options.name': option },
					{ $push: { 'options.$.votes': user } },
				);
				const pollUpdated = await Poll.findOne({ _id: pollId });
				const pollFormatted = formatPollDetails(pollUpdated, userRole, user);
				return pollFormatted;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const close = async (pollId, userRole, user) => {
			try {
				const pollFromDB = await Poll.findOne({ _id: pollId });
				if (!pollFromDB) throw new Error('poll_not_found');
				if (!pollFromDB.active) throw new Error('poll_already_closed');
				await Poll.findOneAndUpdate(
					{ _id: pollId },
					{ active: false },
				);
				const pollUpdated = await Poll.findOne({ _id: pollId });
				const pollFormatted = formatPollDetails(pollUpdated, userRole, user);
				return pollFormatted;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const deleteById = async (pollId, userRole, user) => {
			try {
				const pollFromDB = await Poll.findByIdAndRemove({ _id: pollId });
				if (!pollFromDB) throw new Error('poll_not_found');
				const pollFormatted = formatPollDetails(pollFromDB, userRole, user);
				return pollFormatted;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		return {
			listAll,
			create,
			details,
			updateVotes,
			close,
			deleteById,
		};
	};

	return { start };
};
