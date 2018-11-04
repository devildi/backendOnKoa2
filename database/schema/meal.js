const mongoose = require('mongoose')
const Schema = mongoose.Schema
//const Mixed = Schema.Types.Mixed

const MealSchema = new mongoose.Schema({
	//name: {type: String, unique: true},
  createdAt: String,
  breakfast: [],
  lunch: [],
  supper: [],
  dessert: [],
  status: []
})

MealSchema.pre('save', function(next) {
  next()
})

mongoose.model('Meal', MealSchema)