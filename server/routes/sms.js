'use strict'

let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('../log')
let config = require('../config')

let search = require('../features/search')
let webpage = require('../features/webpage')

let decode = require('../encryption').decode
let encode = require('../encryption').encode

// TODO: bypass encryption on when number is HTTP
function getSMS(req, res) {
	// log.info(req.query)
	// log the information about the phone messaging
	// only save the needed information to the sms object

	let twiml = new MessagingResponse()
	let number = req.query.From || 'HTTP'
	// TODO: change 999 to actual last 3 digits of phone number

	decode(req.query.Body, 999, (err, stdout, stderr) => {
		let q = stdout || ''

		let sms = {
			auth: q.charAt(0),
			app : q.charAt(1),
			msg : q.charAt(2),
			body: q.substring(3)
		}

		if(!config.whitelist.includes(number)) {
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
	})

	function replyWith(str, sms, err = '0') {
		let header = err + sms.app + sms.msg
		if(str.length > config.max_bytes && number != 'HTTP')
			str = 'error: result too large'
		// TODO: change 999 with last 3 digits of req.query.FromNumber
		encode(header + str.toString(), 999, (err, stdout, stderr) => {
			if(err)
				throw err

			twiml.message(stdout)
			res.writeHead(200, {'Content-Type': 'text/xml'})
			res.end(twiml.toString())
			log.info('Sent', stdout.length, 'bytes to', number)
		})
	}	
}

module.exports = { getSMS }