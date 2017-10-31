'use strict'

let request = require('request')
let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('../log')
let google = require('../google') // look into requiring the original
google.resultsPerPage = 10
// let decode = require('../encryption').decode
// let encode = require('../encryption').encode
function decode(str) { return str }
function encode(str) { return str }

function getSMS(req, res) {
	let twiml = new MessagingResponse()

	let q = decode(req.query.Body) || ''
	let sms = {
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	log.info('SMS Received:', JSON.stringify(sms))

	if(sms.auth != 'E') {
		log.warn('auth failed')
		replyWith('auth failed', sms, '1')
		return
	}

	switch(sms.app) {
		case '0':
			search(sms.body)
			break
		case '1':
			webpage(sms.body)
			break
		default:
			log.warn('wrong app')
			replyWith('wrong app', sms, '2')
			break
	}

	function replyWith(str, sms, err = '0') {
		let header = err + sms.app + sms.msg
		twiml.message(header + str.toString())
		res.writeHead(200, {'Content-Type': 'text/xml'})
		res.end(encode(twiml.toString()))
	}

	function webpage(link) {
		console.log(link)
		if(!link.startsWith('http'))
			link = `http://${link}`;
		console.log(link)
		request(link, (err, res, body) => {
			if(!err && res.statusCode === 200) {
				let data = body.replace(/<.*?>/g, '').replace(/\t|\r|\n/g, '')
				replyWith(data, sms)
			}
		})
	}

	function search(query) {
		// google search here
		let data = { links: [] }
		let nextCounter = 0
		let printedCount = 0
		google(query, (err, res) => {
			if(err)
				throw err
			for (let link of res.links) {
				if (link.title == '' || link.href == null || link.title == null)
					continue
				if (link.title.includes ('Image') || link.title.includes('Youtube') || link.href.includes('https://www.youtube'))
					continue

				data.links.push({
					title: link.title,
					url: link.href,
					desc: link.description
				})

				printedCount++
				if (printedCount == 3)
					break
			}

			replyWith(convertJSON(data), sms)
		})
	}
}

function convertJSON(stuff) {
	let res = ''

	for(let link of stuff.links) {
		res += link.title.replace(/\n/g, ' ') + '\n'
		res += link.url.replace(/\n/g, ' ') + '\n'
		res += link.desc.replace(/\n/g, ' ') + '\n'
	}

	return res
}

module.exports = { getSMS }