import {
	Controller,
	setRouter,
} from '../decorator/index'

@Controller('/mooc')
export default class DataFatch {
	@setRouter('get')('/all')
	async getData(ctx, next) {
		console.log('55555')
		ctx.body = {
			data: 'ooo',
			success: true
		}
	}
}