'use strict'

let request = require('request')

function webpage(sms, done) {
	let link = sms.body
	if(!link.startsWith('http'))
		link = `http://${link}`;
	request(link, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			let data = body.replace(/<.*?>/g, '').replace(/\t|\r|\n/g, '')
			done(null, data)
		} else {
			done(4)
		}
	})
}

module.exports = webpage