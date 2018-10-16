import fs from 'fs'
import path from 'path'

export const walk = (pathName) => {
	let data = []
	let section = []
	let sectionItem = {
		name: '',
		addredd: ''
	}
	let chapter = {}
	//遍历目录
	let dirs = fs.readdirSync(pathName)
	if(dirs[0] === '.DS_Store'){
		dirs.splice(0, 1)
	}
	dirs.forEach((item,index) => {
		let newChapter = {...chapter}
		let newSection = [...section]
		newChapter['name1'] = item
		const dirPath = path.join(pathName ,'/' + item)//子目录路径
		//遍历子目录
		let files = fs.readdirSync(dirPath)
		files.forEach((fileName) => {
			let filePath = path.join(dirPath ,'/' + fileName)//文件路径
			let newSectionItem = {
				...sectionItem,
				'name': fileName, 
				'addredd': filePath
			}
			newSection.push(newSectionItem)
		})
		newChapter['content'] = newSection
		data.push(newChapter)
	})
	return data
}

export const promiseFS = (filePath) => {
	return new Promise ((resolve, reject) => {
		fs.readFile(path.join(__dirname, filePath),{encoding:'utf-8'},(err, data) => {
			if(err){
				reject(err)
			}
			if(data){
				data = JSON.parse(data)
			}
			resolve(data)				
		})
	})
}