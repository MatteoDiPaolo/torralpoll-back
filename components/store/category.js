const Category = require('./models/category');
const { formatNewCategoryToDB } = require('./formatters/poll');


module.exports = () => {
	const start = async ({ logger }) => {
		const create = async name => {
			try {
				const newCategory = formatNewCategoryToDB(name);
				const category = await new Category(newCategory).save();
				return category;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};

		const listAll = async () => {
			try {
				const categories = await Category.find({});
				return categories;
			} catch (err) {
				logger.error(err);
				throw err;
			}
		};

		return {
			create,
			listAll,
		};
	};

	return { start };
};
