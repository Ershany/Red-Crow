let log = require('../log')
let cheerio = require('cheerio')
let request = require('request')
let config = require('../config')

const link = 'https://www.reddit.com/r/news/'

function news(sms, done) {
	let data = []

	request(link, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			let $ = cheerio.load(body)
			const rawData = $('div').text()

			// data.push({
			// 	title: xxx.title, desc: xxx.desc
			// })

			done(null, rawData)
			// done(null, convertJSON(data))
		} else {
			done(9)
		}
	})
}

// TODO change from newline character
/*
function convertJSON(stuff) {
	let res = ''

	for(let link of stuff) {
		res += link.title.replace(/\n/g, ' ') + '\n'
			+ link.url.replace(/\n/g, ' ') + '\n'
			+ link.desc.replace(/\n/g, ' ') + '\n'
	}

	return res.slice(0, -1)
}
*/

module.exports = news