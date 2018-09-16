'use strict'

let log = require('../log')
let config = require('../config')
let MessagingResponse = require('twilio').twiml.MessagingResponse
let convertErrorCode = require('../util/error_codes')

const feat_dir = '../features/'
const features = [
	require(feat_dir + 'search'),
	require(feat_dir + 'webpage'),
	require(feat_dir + 'news'),
	require(feat_dir + 'lyrics')
]

function getSMS(sms, done) {
	log.info('SMS >', sms.print())

	if(!config.whitelist.includes(sms.number))
		return done(6)

	if(!sms.hasCompleteHeader())
		return done(1)

	if(sms.auth != config.auth_code)
		return done(2)

	if(!(sms.app in features))
		return done(3)

	return features[sms.app](sms.body, done)
}

function replyWith(err, sms, str) {
	// TODO: incomplete messages need to return with an appID & msgID ...
	if(err) {
		str = config.errors[err]
		log.warn(config.errors[err])
	}

	let header = convertErrorCode(err)  + sms.app + sms.msg + sms.gzip
	return header + str.toString()
}

function smsHandler(req, res, next) {
	const sms = req.SMS

	getSMS(sms, (err, data) => {
		// res.SMS.build(replyWith(null, sms, sms.number === 'HTTP' ? data : data.slice(0, config.max_bytes)))
		if(err) {
			res.SMS.build(replyWith(err, sms))
		} else {
			res.SMS.build(replyWith(null, sms, data.slice(0, config.max_bytes)))
		}
		next()
	})
}

function smsSender(req, res, next) {
	res.set('Content-Type', 'text/xml') // TODO: should be text/xml
	const reply = res.SMS.toString()
	log.info(`Sent ${reply.length} bytes to ${req.SMS.number}`)

	let twiml = new MessagingResponse()

	twiml.message(reply)
	res.end(twiml.toString())
}

module.exports = { smsHandler, smsSender }
