'use strict'

let fs = require('fs')
let MessagingResponse = require('twilio').twiml.MessagingResponse

function getSMS(req, res) {
	let twiml = new MessagingResponse()

	let q = req.query.Body || '' // || '999Error'
	let sms = {
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	if(sms.auth != 'E') {
		replyWith('auth failed')
		return
	}

	switch(sms.app) {
		case '0':
			beatles()
			break
		case '1':
			search()
			break
		default:
			replyWith('wrong app')
			break
	}

	function replyWith(str) {
		twiml.message(str.toString())
		res.writeHead(200, {'Content-Type': 'text/xml'})
		res.end(twiml.toString())
		return
	}

	function beatles() {
		fs.readFile('beatles.txt', (err, data) => {
			if(err)
				throw err
			replyWith(data)
		})
	}

	function search() {
		fs.readFile('google.json', (err, data) => {
			if(err)
				throw err
			// convert json to search response format
			replyWith(data)
		})
	}
}

module.exports = { getSMS }