import {
	join
} from 'path'
import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
import logger from 'koa-logger'
import views from 'koa-views'
import serve from 'koa-static'

export const addLogger = (app) => {
	app.use(logger())
}

export const addSesson = (app) => {
	app.keys = ['mooclntv']

	const CONFIG = {
		key: 'mooclntv',
		maxAge: 86400000,
		autoCommit: true,
		overwrite: true,
		httpOnly: true,
		signed: true,
		rolling: false,
		renew: false,
	}

	app.use(session(CONFIG, app))
}

export const addBodyParser = (app) => {
	app.use(bodyParser({formLimit: '1mb'}))
}

export const addViews = (app) => {
	app.use(views(join(__dirname , '../views'), { extension: 'jade' }))
}

export const addServe = (app) => {
	app.use(serve(join(__dirname , '../views')))
}

// export const add404 = (app) => {
// 	app.use(async function(ctx, next){  
//   	await next
// 	  // if(parseInt(ctx.status) === 404){
// 	  //    ctx.redirect('/')
// 	  // }
// 	})
// }