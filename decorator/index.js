import {
	resolve
} from 'path'
import KoaRouter from 'koa-router'
import R from 'ramda'
import glob from 'glob'

const pathPrefix = Symbol('pathPrefix')
const routeMap = []

export class Route {
	constructor(app, routesPath) {
		this.app = app
		this.router = new KoaRouter()
		this.routesPath = routesPath
	}

	init() {
		const {
			app,
			router,
			routesPath
		} = this
		const files = glob.sync(routesPath + '/*.js')
		files.forEach((i) => {
			require(i)
		})
		R.forEach(
			({
				target,
				method,
				path,
				callback
			}) => {
				const prefix = target[pathPrefix]
				console.log('path', prefix + path)
				router[method](prefix + path, callback)
			}
		)(routeMap)

		console.log(routeMap)

		app.use(router.routes())
		app.use(router.allowedMethods())
	}
}

export const Controller = path => target => {
	target.prototype[pathPrefix] = path
}

export const setRouter = method => path => (target, key, descriptor) => {
	routeMap.push({
		target,
		method,
		path,
		callback: target[key]
	})
	return descriptor
}