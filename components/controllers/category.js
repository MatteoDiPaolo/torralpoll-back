module.exports = () => {
	const start = async ({ config }) => {
		const listAll = () => config.list;

		return {
			listAll,
		};
	};

	return { start };
};
