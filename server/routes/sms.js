'use strict'

let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('../log')
let config = require('../config')

let search = require('../features/search')
let webpage = require('../features/webpage')

// TODO: bypass encryption on when number is HTTP
function getSMS(sms, done) {
	// log.info(query)
	// log the information about the phone messaging
	// only save the needed information to the sms object

	if(!config.whitelist.includes(sms.number))
		return done(null, replyWith(null, sms, 7))

	log.info('SMS:', sms)

	if(sms.msg == '')
		return done(null, replyWith(null, sms, 1))

	if(sms.auth != 'E')
		return done(null, replyWith(null, sms, 2))

	switch(sms.app) {
		case '0':
			// search(sms, replyWith)
			return search(sms, done)
			break
		case '1':
			// webpage(sms, replyWith)
			return webpage(sms, done)
			// return done(null, '010website')
			break
		default:
			return done(null, replyWith(null, sms, 3))
			break
	}
}

// TODO: maybe be able to seperate encoding from here and move to app.js
function replyWith(str, sms, err = 0) {
	let twiml = new MessagingResponse()
	let header = err + sms.app + sms.msg
	
	if(err != 0) {
		str = config.errors[err]
		log.warn(config.errors[err])
	}

	// if(str.length > config.max_bytes && number != 'HTTP') {
	// 	str = config.errors[6]
	// }

	twiml.message(header + str.toString())
	return twiml.toString()
	// res.writeHead(200, {'Content-Type': 'text/xml'})
	// TODO: store the twiml.toString() into the request or response
	// res.end(twiml.toString())
	// log.info('Sent', (header + str.toString()).length, 'bytes to', number)
}

module.exports = function(req, res, next) {
	const q = req.query.Body || ''

	let sms = {
		number: req.query.From || 'HTTP',
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	getSMS(sms, (err, data) => {
		if(err) {
			res.Body = replyWith(null, sms, err)
		} else {
			if(data.length > config.max_bytes && sms.number != 'HTTP') {
				res.Body = replyWith(null, sms, 9)
			} else {
				res.Body = data
			}
		}

		next()
	})
}