const mongoose = require('mongoose');
// const MongoUrl = 'mongodb://localhost:27017/torralpoll';

module.exports = () => {
	const start = async ({ logger }) => {
		mongoose.connect('mongodb://admin:matteotifoso1@ds143774.mlab.com:43774/torralpoll', { useNewUrlParser: true });
		// mongoose.connect(MongoUrl, { useNewUrlParser: true });
		const db = mongoose.connection;
		let Poll;

		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', async () => {
			logger.info('Correctly connected to mongoose');
			// eslint-disable-next-line global-require
			Poll = require('../../lib/store/models/poll');
		});

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
				const poll = await Poll.findOne({ _id: pollId });

				return {
					_id: poll._id,
					name: poll.name,
					description: poll.description,
					active: poll.active,
					options: poll.options.map(op => ({ votes: op.votes, name: op.name })),
				};
			} catch (err) {
				logger.error(err);
				throw err;
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
				const polls = await Poll.find({ });
				return {
					polls: polls.map(p => ({
						_id: p._id,
						name: p.name,
						description: p.description,
						active: p.active,
						options: p.options.map(op => ({ votes: op.votes, name: op.name })),
					})),
				};
			} catch (err) {
				logger.error(err);
				throw err;
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
