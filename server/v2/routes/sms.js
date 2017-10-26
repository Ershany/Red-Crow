'use strict'

let fs = require('fs')
let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('../log')
let decode = require('../encryption').decode
let encode = require('../encryption').encode
// function decode(str) { return str }
// function encode(str) { return str }

function getSMS(req, res) {
	let twiml = new MessagingResponse()

	let q = req.query.Body || ''
	let sms = {
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	log.info(JSON.stringify(sms))

	if(sms.auth != 'E') {
		replyWith('auth failed', sms, '1')
		return
	}

	switch(sms.app) {
		case '0':
			search()
			break
		case '1':
			beatles()
			break
		default:
			replyWith('wrong app', sms, '2')
			break
	}

	function replyWith(str, sms, err = '0') {
		let header = err + sms.app + sms.msg
		twiml.message(header + str.toString())
		res.writeHead(200, {'Content-Type': 'text/xml'})
		res.end(twiml.toString())
	}

	function beatles() {
		fs.readFile('beatles.txt', (err, data) => {
			if(err)
				throw err
			replyWith(data, sms)
		})
	}

	function search() {
		// google search here
		fs.readFile('google.json', (err, data) => {
			if(err)
				throw err
			replyWith(convertJSON(JSON.parse(data)), sms)
		})
	}

	function convertJSON(stuff) {
		let res = ''

		for(let link of stuff.links) {
			res += link.title + '\n'
			res += link.url + '\n'
			res += link.desc + '\n'
		}
		return res
	}
}

module.exports = { getSMS }