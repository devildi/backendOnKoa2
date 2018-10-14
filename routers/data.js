import {
	Controller,
	setRouter,
} from '../decorator/router'

@Controller('/mooc')
export default class DataFatch {
	@setRouter('get')('/all')
	async getData() {
		ctx.body = {
			data: 'ooo',
			success: true
		}
	}
}