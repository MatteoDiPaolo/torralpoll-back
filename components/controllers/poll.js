const { errorFactory } = require('../../lib/errors');

const notFoundError = errorFactory('not_found');
const wrongInputError = errorFactory('wrong_input');
const serverError = errorFactory();

module.exports = () => {
	const start = async ({ store, config }) => {
		const idFormat = /^[a-f\d]{24}$/;

		const create = async (timestampCreation, name, description, options, category, user) => {
			if (!name || typeof name !== 'string') throw wrongInputError(`Name: ${name} is not a valid input`);
			if (!description || typeof description !== 'string') throw wrongInputError(`Description: ${description} is not a valid input`);
			if (!Array.isArray(options) || options.length < 2) throw wrongInputError(`Options: ${options} is not a valid input`);
			if (!config.categories.includes(category)) throw wrongInputError(`Category: ${category} is not supported`);
			try {
				const pollId = await store.create(timestampCreation, name, description, options, category, user);
				return pollId;
			} catch (err) {
				if (err.message === 'poll_with_duplicated_options') throw serverError('New poll has duplicated options');
				throw serverError('Error creating a new poll');
			}
		};

		const listAll = async user => {
			try {
				const polls = await store.listAll(user);
				return polls;
			} catch (err) {
				throw serverError('Error listing polls');
			}
		};


		const vote = async (id, option, user) => {
			if (!id || typeof id !== 'string' || idFormat.test(id)) throw wrongInputError(`Id: ${id} is not a valid input`);
			if (!option || typeof option !== 'string') throw wrongInputError(`Option: ${option} is not a valid input`);
			try {
				const pollId = await store.updateVotes(id, option, user);
				return pollId;
			} catch (err) {
				if (err.message === 'poll_not_found') throw notFoundError(`Poll: ${id} not found`);
				if (err.message === 'poll_not_active') throw serverError(`Poll: ${id} is inactive`);
				if (err.message === 'option_not_available') throw serverError(`Option: ${option} does not exists for poll: ${id}`);
				if (err.message === 'user_has_already_voted') throw serverError(`User: ${user.name} has already voted for poll: ${id}`);
				throw serverError(`Error submitting vote for poll: ${id} - user: ${user.name} - option: ${option}`);
			}
		};


		const details = async (id, user) => {
			if (!id || typeof id !== 'string' || idFormat.test(id)) throw wrongInputError(`Id: ${id} is not a valid input`);
			try {
				const poll = await store.details(id, user);
				return poll;
			} catch (err) {
				if (err.message === 'poll_not_found') throw notFoundError(`Poll: ${id} not found`);
				throw serverError(`Error getting details of poll: ${id}`);
			}
		};


		const close = async id => {
			if (!id || typeof id !== 'string' || idFormat.test(id)) throw wrongInputError(`Id: ${id} is not a valid input`);
			try {
				const pollId = await store.close(id);
				return pollId;
			} catch (err) {
				if (err.message === 'poll_not_found') throw notFoundError(`Poll: ${id} not found`);
				if (err.message === 'poll_already_closed') throw serverError(`Poll: ${id} is already closed`);
				throw serverError(`Error closing poll: ${id}`);
			}
		};


		const deleteById = async id => {
			if (!id || typeof id !== 'string' || idFormat.test(id)) throw wrongInputError(`Id: ${id} is not a valid input`);
			try {
				const poll = await store.deleteById(id);
				return poll;
			} catch (err) {
				if (err.message === 'poll_not_found') throw notFoundError(`Poll: ${id} not found`);
				throw serverError(`Error deleting poll: ${id}`);
			}
		};

		return {
			create,
			listAll,
			details,
			vote,
			close,
			deleteById,
		};
	};

	return { start };
};
