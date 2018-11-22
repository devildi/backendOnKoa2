import {
	resolve
} from 'path'
import KoaRouter from 'koa-router'
import R from 'ramda'
import glob from 'glob'

const pathPrefix = Symbol('pathPrefix')
const routeMap = []

const changeToArr = R.unless(
  R.is(Array),
  R.of
)

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
				router[method](prefix + path, ...callback)
			}
		)(routeMap)

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
		callback: changeToArr(target[key])
	})
	return descriptor
}

const convert = middleware => (target, key, descriptor) => {
  target[key] = R.compose(
    R.concat(
      changeToArr(middleware)
    ),
    changeToArr
  )(target[key])
  return descriptor
}

export const FindTrain = convert(async (ctx, next) => {
  console.log('this is 12306 middleware!')
  ctx.lib= 6666
  await next()
})