import {
	join
} from 'path'
import mongoose from 'mongoose'
import glob from 'glob'

mongoose.Promise = global.Promise

const files = glob.sync(join(__dirname, '../database/schema') + '/*.js')
files.forEach((i) => {
	require(i)
})

export const database = (app) => {
	const db = 'mongodb://localhost/moocLntv'

	mongoose.connect(db, {
		useNewUrlParser: true
	})

	mongoose.connection.on('disconnected', () => {
		mongoose.connect(db, {
			useNewUrlParser: true
		})
	})

	mongoose.connection.on('error', err => {
		console.error(err)
	})

	mongoose.connection.once('open', () => {
		console.log('Connected to MongoDB -> ', db)
	})
}