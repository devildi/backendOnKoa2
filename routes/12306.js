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

		let script = path.resolve(__dirname, scriptPath)
		const execFile = util.promisify(cp.execFile)
		const { stdout } = await execFile('node', [script])
		let result = JSON.parse(stdout)
		ctx.body = {
			data: result,
			success: true
		}



		//let invoked = false
		//let child = await cp.fork(script, [])
		// const p = cp.execFile(
		//   'node', // 可执行文件
		//   [script], // 传递给命令的参数
		//   (err, stdout, stderr) => {
		//     if (err) {
		//       // err.code 是进程退出时的 exit code，非 0 都被认为错误
		//       // err.signal 是结束进程时发送给它的信号值
		//       console.log('err:', err, err.code, err.signal);
		//     }
		//     console.log('stdout:', stdout);
		//     console.log('stderr:', stderr);
		//     ctx.body = {
		// 			data: ctx.lib,
		// 			success: true
		// 		}
		//   }
		// )
		//console.log('child pid:', p.pid);

		// child.on('error', err => {
  //   if (invoked) return
	 //    invoked = true
	    
	 //    console.log('err', err)
	 //  })

	 //  child.on('exit', code => {
	 //    if (invoked) return
	 //    invoked = false
	 //    let err = code === 0 ? '～～～子进程已关闭～～～' : new Error('exit code ' + code)
	    
	 //    console.log(err)
	 //  })

	 //  child.on('message', data => {
	 //    console.log('子进程传回的数据：', data)
	 //    ctx.body = {
		// 		data: data,
		// 		success: true
		// 	}
	 //  })

	  //let arr = ['shenyang', 'shenzhen', 'benxi']

	  // arr.map((i) => {
	  // 	child.send(['beijing', i])
	  // })
	  //child.send(['beijing', 'benxi'])
	}
}