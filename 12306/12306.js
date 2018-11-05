const puppeteer = require('puppeteer')
const url = 'https://kyfw.12306.cn/otn/leftTicket/init'
let from = 'beijing'
let to = 'shenyang'
let arrFrom = [...from]
let arrTo = [...to]
const sleep = time => new Promise(resolve => {
	setTimeout(resolve, time)
})

;(async() => {
	console.log(`开始爬取${from}到${to}的车次！`)

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
	await page.click('#query_ticket')
	await sleep(5000)

	//const bodyHandle = await page.$('.ticket-info')

	const result = await page.evaluate( () => {
			var result = document.querySelectorAll('.ticket-info > .train')

			return result
		}
	)
	//await sleep(3000)

	await page.screenshot({path: 'example.png',fullPage: true})

	browser.close()

	console.log(result)
	//process.send({result})
	//process.exit(0)
})()
