const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
	name: String,
	menu: Object,
});
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
