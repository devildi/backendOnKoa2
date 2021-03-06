const puppeteer = require('puppeteer')
const url = 'https://kyfw.12306.cn/otn/leftTicket/init'

const sleep = time => new Promise(resolve => {
	setTimeout(resolve, time)
})

process.on('message', async(arr) => {
	let arrFrom = [...arr[0]]
	let arrTo = [...arr[1]]
	console.log(`~~~~~~开始爬取${arr[0]}到${arr[1]}的车次~~~~~~`)

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		dumpio: false
	})

	const page = await browser.newPage()
	await page.goto(url, {waitUntil: 'networkidle2'})

	await page.tap('#fromStationText')
	for (let i = 0; i < arrFrom.length; i++){
		await page.keyboard.press(arrFrom[i]);
	}
	await page.keyboard.press('Enter')

	await page.tap('#toStationText')
	for (let i = 0; i < arrTo.length; i++){
		await page.keyboard.press(arrTo[i]);
	}
	await page.keyboard.press('Enter')

	await page.click('#date_range>ul>li:nth-child(2)')
	await sleep(2000)

	const result = await page.evaluate( () => {
			var result = []
			var arr = document.querySelectorAll('.ticket-info')
			for (let i = 0; i < arr.length; i++){
				let No = arr[i].querySelector('.train > div > a').innerText
				let depart = arr[i].querySelector('.cds>.start-t ').innerText
				let arrive = arr[i].querySelector('.cds>.color999').innerText
				result.push({No, depart, arrive})
			}
			return result
		}
	)

	browser.close()

	let hasGOrD = []
	let overNight = []
	result.map((r) => {
		filter(r, hasGOrD, overNight)
	})
	
	let data = {
		from: arr[0],
		to: arr[1],
		hasGOrD,
		overNight
	}
	process.send(data)
	process.exit(0)
})

const filter = (obj, hasGOrD, overNight) => {
	if(obj.No.startsWith('G') || obj.No.startsWith('D')){
		hasGOrD.push(obj.No)
	}
	//夕发朝至（17点～9点）
	if(parseInt(obj.depart.slice(0, 2)) >= 17 &&  parseInt(obj.arrive.slice(0, 2))<= 9){
		overNight.push(obj.No)
	}
}
