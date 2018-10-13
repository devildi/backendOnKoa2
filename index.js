import {
	join
} from 'path'
import R from 'ramda'
import koa from 'koa'

const MIDDLEWARES = ['db', 'general']

const useMiddlewares = (app) => {
	R.map(
		R.compose(
			R.forEachObjIndexed(
				e => e(app)
			),
			require,
			name => join(__dirname, `./midwares/${name}`)
		)
	)(MIDDLEWARES)
}

async function start() {
	const app = new koa()

	await useMiddlewares(app)

	const server = app.listen(3000, () => {
		console.log('start!')
	})
}

start()