import {
	Controller,
	setRouter
} from '../decorator/index'
import mongoose from 'mongoose'
const Cat = mongoose.model('Cat')
const Route = mongoose.model('Route')

@Controller('/api/admin')
export default class fitst {
	@setRouter('post')('/post')
	async post(ctx, next) {
		let user = ctx.request.body.name
		let indexOfDay = ctx.request.body.indexOfDay
	  //解决[object, Object]异常
		let route = JSON.parse(ctx.request.body.cache)

		let route11 = await Route.findOne({user: user}).exec()
		if(!route11){
			let a = null
			a = await Cat.findOne().exec()
			if(a){
				a.all.push(user)
			} else {
				a = new Cat({
					all: []
				})
				a.all.push(user)
			}
			try{
				 a = await a.save()
			}
			catch(err){
				console.log(err)
				ctx.body = {success: false}
				return next
			}
		}
		let routes = await Route.findOne({user: user, indexOfDay: indexOfDay}).exec()
		if(routes){
			route.map((r,i) => {
				routes.route.push(r)
			})
			try{
				routes = await routes.save()
			}
			catch(err){
				console.log(err)
				ctx.body = {success: false}
				return next
			}

		} else {
			let _route = new Route({
				user: user,
				tripName: ctx.request.body.tripName,
				author: ctx.request.body.author,
				indexOfDay: indexOfDay,
				date: ctx.request.body.date,
				useGoogle: ctx.request.body.useGoogle,
				city: ctx.request.body.city,
				route: route
			})
			try{
				let route = await _route.save()
			}
			catch(err){
				console.log(err)
				ctx.body = {success: false}
				return next
			}
		}
		ctx.body = {
			success: true
		}
	}
	@setRouter('post')('/save')
	async save(ctx, next) {
		let route1 = null
		let route = null
		let arrs = JSON.parse(ctx.request.body.cache)
		route1 = await Route.findOne({user: arrs[0].user}).exec()
		if(route1.city !== arrs[0].city){
			route1.city = arrs[0].city
			route1 = await route1.save()
		}
		let Parr = []
		let Parr1 = []
		let dataArr = []
		arrs.map((r, i) => {
			Parr.push(Route.find({user: r.user, indexOfDay: r.indexOfDay}))
		})
		let data = await Promise.all(Parr)
		data.map((r, i) => {dataArr.push(r[0])})
		dataArr.map((r, i) => {
			r.date = arrs[i].date
			r.indexOfDay = arrs[i].indexOfDay
			r.route = arrs[i].route
			Parr1.push(r.save())
		})
		ctx.body = await Promise.all(Parr1)
	}
	@setRouter('get')('/all')
	async all(ctx, next) {
		let name = ctx.query.name || ''
		let data1 = []
		let promiseContainer = []
		let a = await Cat.findOne().exec()
		if(a){
			a.all.map((row, index) => {
				if(row === name) {
					a.all.splice(index, 1)
				}
			})
			a.all.map((r, i) => {
				promiseContainer.push(Route.find({user: r}))
			})
			let data = await Promise.all(promiseContainer)
			data.map((r) => {
				data1.push(r[0])
			})
			ctx.body = {
				data: data1
			}
		} else{
			ctx.body = {
				data: null
			}
		}
	}
	@setRouter('get')('/get')
	async get(ctx, next) {
		let name = ctx.query.name
		let indexOfDay = ctx.query.indexOfDay
		let from = ctx.query.from || ''
		let routes = null
		let play = []
	  let play2 = []
	  let line = []
		let dinner = []
		let hotel = []
		let drawer = []
		let flag= 0
		if(!indexOfDay){
			routes = await Route.find({user: name}).exec()
		} else {
			routes = await Route.find({user: name, indexOfDay: indexOfDay}).exec()
		}	
		if(routes && routes.length > 0){
			drawer = JSON.parse(JSON.stringify(routes))
			let isUsingGoogle = routes[0].useGoogle === '1' ? true : false
			routes.map((item, index) => {
				if (item.route && item.route.length > 0){
					item.route.map((r, i) => {
						if(!from){
							if(isUsingGoogle){
								let obj = JSON.parse(r.location)
					      obj.lat = parseFloat(obj.lat)
					      obj.lng = parseFloat(obj.lng)
					      r.location = obj
							} else {
								r.location = JSON.parse(r.location)
							}
						}
		      	//点数据分类
			      if(r.pointOrNot === '1' && r.category === '0'){
			        play2.push(r)
			      } else if(r.pointOrNot === '1' && r.category === '1'){
			        dinner.push(r)
			        if(!from){
			        	drawer[index].route.splice((i - flag),1)
			        	flag++
			        }
			      } else if(r.pointOrNot === '1' && r.category === '2'){
			        hotel.push(r)
			        if(!from){
			        	drawer[index].route.splice((i - flag),1)
			        	flag++
			        }
			      } else{
			        line.push(r)
			      }
		    	})
				}
			})
		}

		ctx.body = {
			data: from ? routes : drawer,
			//点数据
			data1: play2,
			dinner: dinner,
			hotel: hotel
		}
	}
}