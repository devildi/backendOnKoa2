import {
	resolve
} from 'path'
import KoaRouter from 'koa-router'
import R from 'ramda'

const pathPrefix = Symbol('pathPrefix')
const routeMap = []

export class Router {
	constructor(app, routesPath) {
		this.app = app
		this.router = new KoaRouter()
		this.routesPath = routesPath
	}

	init = () => {
		const {
			app,
			router,
			routesPath
		} = this

		app.use(router.routes())
		app.use(router.allowedMethods())
	}
}