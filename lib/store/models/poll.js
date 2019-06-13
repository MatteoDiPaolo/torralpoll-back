const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pollOptionSchema = new Schema({
	name: String,
	votes: [String],
});
mongoose.model('PollOption', pollOptionSchema);

const pollSchema = new Schema({
	name: String,
	active: Boolean,
	options: [pollOptionSchema],
});
const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
