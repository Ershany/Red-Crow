'use strict'

let log = require('../log')
let config = require('../config')
let MessagingResponse = require('twilio').twiml.MessagingResponse
let convertErrorCode = require('../util/error_codes')

let fs = require('fs') // TODO: temporary for testing

const feat_dir = '../features/'
const features = [
	require(feat_dir + 'search'),
	require(feat_dir + 'webpage'),
	require(feat_dir + 'news'),
	require(feat_dir + 'lyrics')
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
		
	return features[sms.app](sms.body, done)
}

function replyWith(err, sms, str) {
	// TODO: incomplete messages need to return with an appID & msgID ...
	let twiml = new MessagingResponse()
	
	if(err) {
		str = config.errors[err]
		log.warn(config.errors[err])
	}

	let header = convertErrorCode(err)  + sms.app + sms.msg
	twiml.message(header + str.toString())
	return twiml.toString()
}

module.exports = function(req, res, next) {
	// res.writeHead(200, {'Content-Type': 'text/xml'}) // TODO: should be text/xml

	const q = req.query.Body || ''
	let sms = {
		number: req.query.From || 'HTTP', // +16137954472
		auth: q.charAt(0),
		app : q.charAt(1),
		msg : q.charAt(2),
		body: q.substring(3)
	}

	getSMS(sms, (err, data) => {
		if(err) {
			res.Body = replyWith(err, sms)
		} else {
			let compress = require('../encryption').compressLocal
			compress(res.Body, (err, stdout, stderr) => {
				console.log('err', err)
				console.log('stdout', stdout)
				console.log('stderr', stderr)
				fs.readFile('./tmp/daft.txt.gz', (err, data) => {
					if(err)
						throw err
					for(let i = 0; data[i] != undefined; i++)
						console.log(i + 'th byte:', data[i], String.fromCharCode(data[i]))
					let newstr = data.filter(function(b) {
						return b > 65 && b < 91
					})

					console.log('filtered:', newstr.toString())
					console.log('raw data:', data.toString())

					res.end(replyWith(null, sms, data.toString()))
					// res.sendFile('C:\\Users\\Michael\\Desktop\\Red-Crow\\server\\tmp\\daft.txt.gz')
				})
			})
			// if(data.length > config.max_bytes && sms.number != 'HTTP') {
			// 	res.Body = replyWith(7, sms)
			// } else {
			// 	res.Body = replyWith(null, sms, data)
			// }
		}

		// TODO: sent data currently includes the xml portion 
		// log.info(`Sent ${res.Body.length} bytes to ${sms.number}`)
		// if(req.Encryption)
		// 	next()
		// else {
		// 	res.end(res.Body)
		// }
	})
}