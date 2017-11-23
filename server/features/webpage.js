'use strict'

let request = require('request')
let html_strip = require('../util/html_strip')

function webpage(sms, done) {
	if(!sms)
		return done(1)

	let link = sms
	if(!link.startsWith('http'))
		link = `http://${link}`;
	// TODO: check if link is a valid url before doing the request
	request(link, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			done(null, html_strip(body))
		} else {
			done(4)
		}
	})
}

module.exports = webpage