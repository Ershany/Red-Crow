'use strict'

let google = require('google')
let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('../log')
let decode = require('../encryption').decode
let encode = require('../encryption').encode

google.resultsPerPage = 5

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
			googleSearch(msg_body).then((results) => {
				let message = {
					response_type: 'in_channel',
					attachments: []
				};

				for(var result of results) {
					let attachment = {
						title: result.title,
						title_link: result.href,
						text: result.description
					}
					
					// Exclude dead links to Images, News, and Books
					if(!/^Images/.test(result.title) && !/^News/.test(result.title) && !/^Books/.test(result.title))
						message.attachments.push(attachment);
				}

				reply = JSON.stringify(message)
				console.log(reply)
			})
			.catch((err) => {
				res.sendStatus(err);
			})
			// TODO: google search here

			// var nextCounter = 0

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

function googleSearch(query) {
	let promise = new Promise((resolve, reject) => {
		google(query, (err, next, links) => {
			if(err) log.error(err)

			let topFiveLinks = links.slice(0, 6)
			resolve(topFiveLinks)
		})
	})

	return promise
}

module.exports = { getSMS }