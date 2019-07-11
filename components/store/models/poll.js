const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	given_name: String,
	family_name: String,
	email: String,
	picture: String,
	rol: String,
});
mongoose.model('User', userSchema);


const pollOptionSchema = new Schema({
	name: String,
	votes: [userSchema],
});
mongoose.model('PollOption', pollOptionSchema);


const pollSchema = new Schema({
	timestampCreation: Date,
	name: String,
	description: String,
	active: Boolean,
	options: [pollOptionSchema],
	createdBy: userSchema,
});
const Poll = mongoose.model('Poll', pollSchema);


module.exports = Poll;
