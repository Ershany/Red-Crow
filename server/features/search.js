'use strict'

let log = require('../log')
let google = require('../google') // look into requiring the original

function search(sms, done) {
	google.resultsPerPage = 10

	google(sms.body, (err, res) => {
		if(err) {
			log.warn('search failed')
			done('search failed', sms, '5')
			return
		}
		for (let link of res.links) {
			if (link.title == '' || link.href == null || link.title == null)
				continue
			if (link.title.includes ('Image') || link.title.includes('Youtube') || link.href.includes('https://www.youtube'))
				continue

				title: link.title,
				url: link.href,
				desc: link.description
			})

				break
		}

		done(convertJSON(data), sms)
	})
}

function convertJSON(stuff) {
	let res = ''

		res += link.title.replace(/\n/g, ' ') + '\n'
			+ link.url.replace(/\n/g, ' ') + '\n'
			+ link.desc.replace(/\n/g, ' ') + '\n'
	}

	return res.slice(0, -1)
}


module.exports = search
