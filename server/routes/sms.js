'use strict'

let MessagingResponse = require('twilio').twiml.MessagingResponse
let log = require('../log')
let decode = require('../encryption').decode
let encode = require('../encryption').encode

function getSMS(req, res) {
	log.info('Received SMS:', req.query.Body)
	// log.info(req.query)

	let err_code = 0

	if(!(req && req.query && req.query.Body)) {
		log.warn('No Query Received')
		err_code |= 1 << 0
		// return res.sendStatus(500)
	}

	var decoded = decode(req.query.Body)
	let app_id = decoded.charAt(1) // charCodeAt
	let msg_id = decoded.charAt(2) // charCodeAt
	let msg_body = decoded.substr(3)

	if(decoded.length < 4) {
		log.warn('Received Insufficient Data')
		err_code |= 1 << 1
		// TODO: don't return before sending reply to phone
		// return res.sendStatus(500)
	}

	if(!decoded.startsWith('E')) {
		log.warn('Check Byte Fail')
		err_code |= 1 << 2
		// return res.sendStatus(500)
	}

	let reply = 'Unknown Command'

	switch(app_id) {
		case '0': // 0
			log.info('Google Search Request: %s', msg_body)
			// TODO: google search here
			let replyJSON = {
				links: [
					{t: 'title1', u: 'url1', d: 'description1'},
					{t: 'title2', u: 'url2', d: 'description2'},
					{t: 'title3', u: 'url3', d: 'description3'},
					{t: 'title4', u: 'url4', d: 'description4'},
					{t: 'title5', u: 'url5', d: 'description5'},
				]
			}
			reply = JSON.stringify(replyJSON)
			break
		case '1': // 1
			log.info('Webpage Request: %s', msg_body)
			reply = 'webpages use too much data :)'
			break
		default:
			log.warn('Unimplemented Application')
			err_code |= 1 << 3
			break
	}

	let twiml = new MessagingResponse()
	let text_reply = encode(app_id + msg_id + err_code + reply)
	twiml.message(text_reply)
	res.writeHead(200, {'Content-Type': 'text/xml'})
	res.end(twiml.toString())

	log.info('Sent %d bytes to user %d', text_reply.length, 6137954472) // TODO: get actual number
}

module.exports = { getSMS }