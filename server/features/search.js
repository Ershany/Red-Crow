'use strict'

let google = require('../google') // look into requiring the original
let config = require('../config')

function search(sms, done) {
	let data = []

	google(sms, (err, res) => {
		if(err)
			return done(5)

		for (let link of res.links) {
			if (link.title == '' || link.href == null || link.title == null)
				continue
			if (link.title.includes ('Image') || link.title.includes('Youtube') || link.href.includes('https://www.youtube'))
				continue

			data.push({
				title: link.title,
				url: link.href,
				desc: link.description
			})

			if (data.length == config.search_limit)
				break
		}

		done(null, convertJSON(data))
	})
}

// TODO change from newline character
function convertJSON(stuff) {
	let res = ''

	for(let link of stuff) {
		res += link.title.replace(/\n/g, ' ') + '\n'
			+ link.url.replace(/\n/g, ' ') + '\n'
			+ link.desc.replace(/\n/g, ' ') + '\n'
	}

	return res.slice(0, -1)
}

module.exports = search