const puppeteer = require('puppeteer')
const url = 'https://kyfw.12306.cn/otn/leftTicket/init'
var i
const sleep = time => new Promise(resolve => {
	setTimeout(resolve, time)
})

;(async() => {
	console.log('Start!')

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		dumpio: false
	})

	const page = await browser.newPage()

	await page.goto(url, {waitUntil: 'networkidle2'})

	const result = await page.evaluate( () => {
			document.getElementById("fromStation").value = 'BJP'
			document.getElementById("toStation").value = 'SYT'
			document.querySelector(".end").click()
			document.querySelector("#query_ticket").click()
			var result = document.querySelectorAll(".train")
			return result
		}
	)
	await sleep(10000)

	await page.screenshot({path: 'example.png',fullPage: true})

	browser.close()

	console.log(result)
	//process.send({result})
	//process.exit(0)
})()
