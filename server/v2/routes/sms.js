'use strict'

let fs = require('fs')
let MessagingResponse = require('twilio').twiml.MessagingResponse

module.exports = function (req, res) {
	let twiml = new MessagingResponse()

	let q = req.query.Body || ''
	let sms = {
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	if(sms.auth != 'E') {
		replyWith('auth failed', sms, '1')
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
			// convert json to search response format
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
		console.log(res)
		return res
	}
}