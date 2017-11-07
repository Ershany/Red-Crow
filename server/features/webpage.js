'use strict'

let log = require('../log')
let request = require('request')

function webpage(sms, done) {
	let link = sms.body
	if(!link.startsWith('http'))
		link = `http://${link}`;
	request(link, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			let data = body.replace(/<.*?>/g, '').replace(/\t|\r|\n/g, '')
			done(data, sms)
		} else {
			log.warn('http failed')
			done('http failed', sms, '4')
		}
	})
}

module.exports = webpage