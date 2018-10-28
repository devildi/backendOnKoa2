import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
const Meal = mongoose.model('Meal')

import {
	Controller,
	setRouter,
} from '../decorator/index'
import util from 'util'

import {
	walk,
	promiseFS
} from '../tools'

const convert = (string) => {
	switch (string) {
		case '早饭':
			return 'breakfast';
		case '午饭':
			return 'lunch';
		case '晚饭':
			return 'supper';
		case '零食':
			return 'dessert';
		case '身体状态':
			return 'status';
		default:
			return 'exercise';
	}
}

@Controller('/meal')
export default class MealAndHealth {
	@setRouter('post')('/item')
	async postData(ctx, next) {
		let meal = null
		const arr = ctx.request.body.arr
		let itemName = convert(arr[0].name)
		arr.splice(0, 1)
		meal = await Meal.findOne({})
		if (meal) {
			meal[itemName] = arr
			meal = await meal.save()
			console.log(meal)
		} else {
			meal = new Meal({
				breakfast: arr
			})
			meal = await meal.save()
		}
		ctx.body = {
			data: meal,
			success: true
		}
	}
	@setRouter('get')('/item')
	async getData(ctx, next) {
		let meal = await Meal.findOne({})
		ctx.body = {
			data: meal,
			success: true
		}
	}
}