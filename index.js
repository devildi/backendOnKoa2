import {
	join
} from 'path'
import R from 'ramda'
import koa from 'koa'

const MIDDLEWARES = ['db', 'general', 'router']

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
	//404
	app.use(async function(ctx, next){  
  	await next
	  if(parseInt(ctx.status) === 404){
	     ctx.redirect('/')
	  }
	})
	
	const server = app.listen(3000, () => {
		console.log('start!')
	})
}

start()