'use strict'

let log = require('../log')
let config = require('../config')
let MessagingResponse = require('twilio').twiml.MessagingResponse

const feat_dir = '../features/'
const features = [
	require(feat_dir + 'search'),
	require(feat_dir + 'webpage')
]

function getSMS(sms, done) {
	log.info('SMS:', sms)

	if(!config.whitelist.includes(sms.number))
		return done(6)

	if(!sms.msg)
		return done(1)

	if(sms.auth != 'E')
		return done(2)

	if(!(sms.app in features))
		return done(3)
		
	return features[sms.app](sms, done)
}

function replyWith(err, sms, str) {
	// TODO: incomplete messages need to return with an appID & msgID ...
	let twiml = new MessagingResponse()
	let header = (err || 0)  + sms.app + sms.msg
	
	if(err) {
		str = config.errors[err]
		log.warn(config.errors[err])
	}

	twiml.message(header + str.toString())
	return twiml.toString()
}

module.exports = function(req, res, next) {
	res.writeHead(200, {'Content-Type': 'text/plain'}) // TODO: should be text/xml

	const q = req.query.Body || ''
	let sms = {
		number: req.query.From || 'HTTP',
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	getSMS(sms, (err, data) => {
		if(err) {
			res.Body = replyWith(err, sms)
		} else {
			if(data.length > config.max_bytes && sms.number != 'HTTP') {
				res.Body = replyWith(7, sms)
			} else {
				res.Body = data
			}
		}

		// TODO: sent data currently includes the xml portion 
		log.info(`Sent ${res.Body.length} bytes to ${sms.number}`)
		if(req.Encryption)
			next()
		else
			res.end(res.Body)
	})
}