const { errorFactory } = require('../../lib/errors');

const notFoundError = errorFactory('not_found');
// const unauthorizedError = errorFactory('unauthorized');
// const wrongInputError = errorFactory('wrong_input');

module.exports = () => {
	const start = async ({ logger, store }) => {
		const create = async (name, description, options) => {
			try {
				const pollId = await store.create(name, description, options);
				const res = { url: `https://torralpoll.lucas1004jx.now.sh/polls?id=${pollId}` };
				return res;
			} catch (err) {
				logger.error(err);
				const res = { res: 'Unable to create a new poll' };
				return res;
			}
		};

		const close = async id => {
			try {
				await store.close(id);
				return {};
			} catch (err) {
				logger.error(err);
				const res = { res: `Error closing poll: ${id}` };
				return res;
			}
		};

		const details = async id => {
			const poll = await store.details(id);
			if (!poll) throw notFoundError(`Poll with id: ${id} not found`);
			return poll;
		};

		const vote = async (id, user, option) => {
			try {
				await store.updateVotes(id, user, option);
				return {};
			} catch (err) {
				logger.error(err);
				const res = { res: `Error submitting vote for poll: ${id} - user: ${user} - option: ${option}` };
				return res;
			}
		};


		const listAll = async () => {
			try {
				const res = await store.listAll();
				return res;
			} catch (err) {
				logger.error(err);
				const res = { res: 'Error listing polls' };
				return res;
			}
		};

		const deleteById = async id => {
			try {
				const res = await store.deleteById(id);
				return res;
			} catch (err) {
				logger.error(err);
				const res = { res: 'Error delete by id' };
				return res;
			}
		};

		return {
			create,
			close,
			details,
			vote,
			listAll,
			deleteById,
		};
	};

	return { start };
};
