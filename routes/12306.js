const cp = require('child_process')
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import {
	Controller,
	setRouter,
	FindTrain
} from '../decorator/index'
const scriptPath = '../12306/12306'

@Controller('/12306')
export default class Trailer {
	@setRouter('get')('/get')
	@FindTrain
	async postData(ctx, next) {

		let invoked = false
		let script = path.resolve(__dirname, scriptPath)
		let child = await cp.fork(script, [])

		child.on('error', err => {
    if (invoked) return
	    invoked = true
	    
	    console.log('err', err)
	  })

	  child.on('exit', code => {
	    if (invoked) return
	    invoked = false
	    let err = code === 0 ? '～～～子进程已关闭～～～' : new Error('exit code ' + code)
	    
	    console.log(err)
	  })

	  child.on('message', data => {
	    console.log('子进程传回的数据：', data)
	    ctx.body = {
				data: data,
				success: true
			}
			console.log(ctx.body)
	  })

	  //let arr = ['shenyang', 'shenzhen', 'benxi']

	  // arr.map((i) => {
	  // 	child.send(['beijing', i])
	  // })
	  child.send(['beijing', 'benxi'])
	  ctx.body = {
			data: ctx.lib,
			success: true
		}
	}
}