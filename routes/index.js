import {
	Controller,
	setRouter
} from '../decorator/index'

@Controller('/index')
export default class fitstPage {
	@setRouter('get')('')
	async fitstPage(ctx, next) {
		await ctx.render('index', {})
	}
}