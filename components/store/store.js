const mongoose = require('mongoose');

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


		return {};
	};

	return { start };
};
