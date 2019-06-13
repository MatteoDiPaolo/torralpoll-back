const mongoose = require('mongoose');

module.exports = () => {
	const start = async ({ logger }) => {
		mongoose.connect('mongodb+srv://admin:admin@cluster0-ezkry.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
		const db = mongoose.connection;
		let Poll;

		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', async () => {
			logger.info('Correctly connected to mongoose');
			// eslint-disable-next-line global-require
			Poll = require('../../lib/store/models/poll');
		});

		const create = async (name, options) => {
			const poll = {
				name,
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
						active: p.active,
						options: p.options.map(op => ({ votes: op.votes, name: op.name })),
					})),
				};
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
		};
	};

	return {
		start,
	};
};
