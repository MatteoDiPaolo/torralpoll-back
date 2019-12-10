module.exports = () => {
	const start = async ({ store }) => {
		const create = async name => {
			const category = await store.create(name);
			return category;
		};

		const listAll = async () => {
			const categories = await store.listAll();
			return categories;
		};
		return {
			create,
			listAll,
		};
	};

	return { start };
};
