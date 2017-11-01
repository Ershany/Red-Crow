'use strict'

let request = require('request')
let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('../log')
let google = require('../google') // look into requiring the original
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
			search(sms.body)
			break
		case '1':
			webpage(sms.body)
			break
		default:
			log.warn('wrong app')
			replyWith('wrong app', sms, '3')
			break
	}

	function replyWith(str, sms, err = '0') {
		let header = err + sms.app + sms.msg
		let reply = encode(header + str.toString())
		twiml.message(reply)
		res.writeHead(200, {'Content-Type': 'text/xml'})
		res.end(twiml.toString())

		log.info('Sent', reply.length, 'bytes to', number)
	}

	function webpage(link) {
		if(!link.startsWith('http'))
			link = `http://${link}`;
		request(link, (err, res, body) => {
			if(!err && res.statusCode === 200) {
				let data = body.replace(/<.*?>/g, '').replace(/\t|\r|\n/g, '')
				replyWith(data, sms)
			} else {
				log.warn('http failed')
				replyWith('http failed', sms, '4')
			}
		})
	}

	function search(query) {
		let data = { links: [] }
		let printedCount = 0
		google.resultsPerPage = 10
		google(query, (err, res) => {
			if(err) {
				log.warn('search failed')
				replyWith('search failed', sms, '5')
				return
			}
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
			+ link.url.replace(/\n/g, ' ') + '\n'
			+ link.desc.replace(/\n/g, ' ') + '\n'
	}

	return res.slice(0, -1)
}

module.exports = { getSMS }