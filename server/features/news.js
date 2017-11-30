'use strict'

let log = require('../log')
let cheerio = require('cheerio')
let request = require('request')
let config = require('../config')

function news(sms, done) {
	let link = 'https://www.reddit.com/r/'+sms
	let data = []
	let z = 0
	let tmp = []

	request(link, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			let $ = cheerio.load(body)
			const rawData = $('div').text().trim()
			var a = rawData.slice(16500).split(')')
			for(var i = 0; i < a.length;i++){
				if(z == config.news_limit)
					break
				if (tmp.includes(a[i])){
					let t = a[i].slice(a[i].indexOf('commentssharesavehidereport')+37,a[i].indexOf(' ('))
					while (t.match(/^\d/) || t.startsWith('k')||t.startsWith('.') || t.startsWith('Soft paywall')){
						if (t.match(/^\d/))
							t = t.replace(/^\d/, '')
						else if (t.startsWith('k'))
							t = t.replace('k', '')
						else if (t.startsWith('.'))
							t = t.replace('.', '')
						else if(t.startsWith('Soft paywall'))
							t = t.replace('Soft paywall','')
					}
					if (t != ''){
						data.push({
							title: t
						})
						z++
					}
				} else
					tmp.push(a[i])
			}
			done(null, convertJSON(data))
		} else {
			done(9)
		}
	})
}

// TODO change from newline character
function convertJSON(stuff) {
	let res = ''

	for(let link of stuff) {
		res += link.title.replace(/\n/g, ' ') + '\n'
	}

	return res.slice(0, -1)
}

module.exports = news