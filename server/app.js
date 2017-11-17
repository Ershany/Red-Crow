'use strict'

let express = require('express')
let MessagingResponse = require('twilio').twiml.MessagingResponse

let log = require('./log')
let dbms = require('./dbms')
let sms = require('./routes/sms')
let config = require('./config')

let decode = require('./encryption').decode
let encode = require('./encryption').encode

const PORT = config.port
let app = express()

dbms.connect(config.database)

// app.route('/sms').get(sms.getSMS)
app.get('/sms', decrypt, smsHandler, encrypt)

app.listen(PORT, () => {
	log.info('Express @ localhost:%d', PORT)
})

// TODO: check if encryption is set in message header
// TODO: replace 999 with req.query.From (phone number)

function decrypt(req, res, next) {
	console.log('encrypted shit you sent:', req.query.Body)
	decode(req.query.Body, 999, (err, stdout, stderr) => {
		console.log('shit you actually sent:', stdout)
		req.query.Body = stdout
		next()
	})
}

function smsHandler(req, res, next) {
	res.Body = 'michael is a good guy'
	next()
}

function encrypt(req, res, next) {
	console.log('shit you want:', res.Body)
	res.writeHead(200, {'Content-Type': 'text/plain'}) // TODO: change to text/xml
	encode(res.Body, 999, (err, stdout, stderr) => {
		console.log('encrypted shit you get:', stdout)
		res.end(stdout)
	})
}