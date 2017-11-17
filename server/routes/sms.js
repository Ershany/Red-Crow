'use strict'

let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('../log')
let config = require('../config')

let search = require('../features/search')
let webpage = require('../features/webpage')

// TODO: bypass encryption on when number is HTTP
function getSMS(query) {
	// log.info(query)
	// log the information about the phone messaging
	// only save the needed information to the sms object

	let q = query.Body || ''
	let number = query.From || 'HTTP'

	let sms = {
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	if(!config.whitelist.includes(number)) {
		log.warn('non-whitelisted number', number)
		replyWith('non-whitelisted number', sms, '7')
		return
	}

	log.info('SMS %s:', number, sms)

	if(q.length < 3) {
		log.warn('incomplete message')
		replyWith('incomplete message', sms, '1')
		return
	}

	if(sms.auth != 'E') {
		log.warn('auth failed')
		replyWith('auth failed', sms, '2')
		return
	}

	switch(sms.app) {
		case '0':
			search(sms, replyWith)
			break
		case '1':
			webpage(sms, replyWith)
			break
		default:
			log.warn('wrong app')
			replyWith('wrong app', sms, '3')
			break
	}
}

// TODO: maybe be able to seperate encoding from here and move to app.js
function replyWith(str, sms, err = '0') {
	let twiml = new MessagingResponse()
	let header = err + sms.app + sms.msg
	if(str.length > config.max_bytes && number != 'HTTP')
		str = 'error: result too large'

	twiml.message(header + str.toString())
	res.writeHead(200, {'Content-Type': 'text/xml'})
	// TODO: store the twiml.toString() into the request or response
	res.end(twiml.toString())
	log.info('Sent', (header + str.toString()).length, 'bytes to', number)
}

module.exports = function(req, res, next) {

}