const Poll = require('./models/poll');
const { formatNewPollToDB, formatPollCreateFromDB, formatPollsListFromDB, formatPollDetailsFromDB, formatPollCreatorFromDB } = require('./formatters/poll');
const { userHasAlreadyVoted, optionDoesExists, newPollHasDuplicatedOptions } = require('./utils/helpers');

module.exports = () => {
	const start = async ({ logger }) => {
		const create = async (timestampCreation, name, description, options, category, user) => {
			try {
				if (newPollHasDuplicatedOptions(options)) throw new Error('poll_with_duplicated_options');
				const newPoll = formatNewPollToDB(timestampCreation, name, description, options, category, user);
				const newPollFromDB = await new Poll(newPoll).save();
				return formatPollCreateFromDB(newPollFromDB);
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};

		const listAll = async user => {
			try {
				const pollsListFromDB = await Poll.find({});
				return formatPollsListFromDB(pollsListFromDB, user);
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};

		const updateVotes = async (id, option, user) => {
			try {
				const pollFromDB = await Poll.findOne({ _id: id });
				if (!pollFromDB) throw new Error('poll_not_found');
				if (!pollFromDB.active) throw new Error('poll_not_active');
				if (!optionDoesExists(option, pollFromDB)) throw new Error('option_not_available');
				if (userHasAlreadyVoted(user, pollFromDB)) throw new Error('user_has_already_voted');
				await Poll.findOneAndUpdate(
					{ _id: id, 'options.name': option },
					{ $push: { 'options.$.votes': user } },
				);
				return { id };
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const details = async (id, user) => {
			try {
				const pollFromDB = await Poll.findOne({ _id: id });
				if (!pollFromDB) throw new Error('poll_not_found');
				const pollFormatted = formatPollDetailsFromDB(pollFromDB, user);
				return pollFormatted;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const creator = async id => {
			try {
				const pollFromDB = await Poll.findOne({ _id: id });
				if (!pollFromDB) throw new Error('poll_not_found');
				const pollFormatted = formatPollCreatorFromDB(pollFromDB);
				return pollFormatted;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const close = async id => {
			try {
				const pollFromDB = await Poll.findOne({ _id: id });
				if (!pollFromDB) throw new Error('poll_not_found');
				if (!pollFromDB.active) throw new Error('poll_already_closed');
				await Poll.findOneAndUpdate(
					{ _id: id },
					{ active: false },
				);
				await Poll.findOne({ _id: id });
				return { id };
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};


		const deleteById = async id => {
			try {
				const pollFromDB = await Poll.findByIdAndRemove({ _id: id });
				if (!pollFromDB) throw new Error('poll_not_found');
				return { id };
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};

		return {
			listAll,
			create,
			updateVotes,
			details,
			close,
			deleteById,
			creator,
		};
	};

	return { start };
};
