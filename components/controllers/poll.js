
module.exports = () => {
	const start = async ({ logger, store }) => {
		const create = async options => {
			try {
				const pollId = await store.create(options);
				const res = { url: `http://torralpoll.com/poll?id=${pollId}` };
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
			try {
				const res = await store.details(id);
				return res;
			} catch (err) {
				logger.error(err);
				const res = { res: `Error getting details for poll: ${id}` };
				return res;
			}
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

		return {
			create,
			close,
			details,
			vote,
		};
	};

	return { start };
};
