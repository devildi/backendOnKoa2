const cp = require('child_process')
const util = require('util')

import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import {
	Controller,
	setRouter,
	FindTrain
} from '../decorator/index'
const scriptPath = '../12306/test'

@Controller('/12306')
export default class Trailer {
	@setRouter('get')('/get')
	@FindTrain
	async postData(ctx, next) {
		let promiseArr = []
		let resultArr = []
		let arr = ['shenyang', 'benxi', 'dandong']
		let script = path.resolve(__dirname, scriptPath)
		const execFile = util.promisify(cp.execFile)
		arr.map((i) => {
			promiseArr.push(execFile('node', [script, 'beijing', i]))
		})
		let result = await Promise.all(promiseArr)
		if(result){
			result.map((i) => {
				resultArr.push(JSON.parse(i.stdout))
			})
		}
		ctx.body = {
			data: resultArr,
			success: true
		}
	}
}