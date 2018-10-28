import fs from 'fs'
import path from 'path'
import {
	Controller,
	setRouter,
} from '../decorator/index'
import util from 'util'

import {
	walk,
	promiseFS
} from '../tools'

@Controller('/mooc')
export default class DataFatch {
	@setRouter('get')('/all')
	async getData(ctx, next) {
		const exist = await util.promisify(fs.exists)(path.join(__dirname, '../data.txt'))
		let data = null
		if (exist) {
			console.log('数据文件存在！')
			data = await promiseFS('data.txt')
		} else {
			console.log('数据文件不存在！')
			data = walk('/Volumes/WOODY/0992、Koa2框架从0开始构建预告片网站')
			try {
				fs.writeFile(path.join(__dirname, '../data.txt'), JSON.stringify(data), function(err) {
					if (err) {
						console.log(err)
					}
					console.log('数据文件写入成功！')
				})
			} catch (err) {
				console.log(err)
			}
		}
		ctx.body = {
			data: data,
			success: true
		}
	}
}