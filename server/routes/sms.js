'use strict'

let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('../log')
let cfg = require('../config')

let search = require('../features/search')
let webpage = require('../features/webpage')

// let decode = require('../encryption').decode
// let encode = require('../encryption').encode
function decode(str) { return str }
function encode(str) { return str }

function getSMS(req, res) {
	// log.info(req.query)
	// log the information about the phone messaging
	// only save the needed information to the sms object

	let twiml = new MessagingResponse()
	let number = req.query.From || 'HTTP'
	let q = decode(req.query.Body) || ''
	let sms = {
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	if(!cfg.whitelist.includes(number)) {
		log.warn('non-whitelisted number')
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

	function replyWith(str, sms, err = '0') {
		let header = err + sms.app + sms.msg
		if(str.length > 2000 && number != 'HTTP')
			str = 'error: result too large'
		let reply = encode(header + str.toString())
		twiml.message(reply)
		res.writeHead(200, {'Content-Type': 'text/xml'})
		res.end(twiml.toString())

		log.info('Sent', reply.length, 'bytes to', number)
	}	
}

module.exports = { getSMS }