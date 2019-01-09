import {
	resolve
} from 'path'

import {
	Route
} from '../decorator/index'

export const router = (app) => {
	const routesPath = resolve(__dirname, '../routes')
	const instance = new Route(app, routesPath)

	instance.init()
	
	
}