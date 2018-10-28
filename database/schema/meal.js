const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const MealSchema = new mongoose.Schema({
  breakfast: [],
  lunch: [],
  supper: [],
  dessert: [],
  status: [],
  exercise: [],
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

MealSchema.pre('save', function(next) {
  next()
})

mongoose.model('Meal', MealSchema)