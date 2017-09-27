'use strict'

const mysql = require('mysql')
const express = require('express')
const winston = require('winston') // make a seperate logger file?
const MessagingResponse = require('twilio').twiml.MessagingResponse

const PORT = 9001
const app = express()

const ERROR_CODES = {
	CHECK_BYTE: 1,
	DATA: 2
}

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'potato'
})

// google search api key
// AIzaSyD62XwkP-5dwJ6eaewoySIqfYvjctvAGKs

con.connect((err) => {
	if(err)
		throw err
	winston.info('Connected to MySQL Database')
})

// Change to a POST request?
app.get('/sms', (req, res) => {
	winston.info(new Date().toLocaleTimeString(), '- Received SMS:', req.query.Body)
	winston.info(req.query)

	if(!(req && req.query && req.query.Body)) {
		winston.warn('No Query Received')
		return res.sendStatus(500)
	}

	var decoded = decode(req.query.Body)

	if(decoded.length < 4) {
		winston.warn('Received Insufficient Data')
		return res.sendStatus(500)
	}

	if(!decoded.startsWith('E')) {
		winston.warn('Check Byte Fail')
		return res.sendStatus(500)
	}

	let app_id = decoded.charAt(1) // charCodeAt
	let msg_id = decoded.charCodeAt(2)
	let msg_body = decoded.substr(3)
	let reply = 'Unknown Command'
	switch(app_id) {
		case '0': // 0
			winston.info('Google Search Request: %s', msg_body)
			reply = 'cats are great, ' + msg_body
			break;
		default:
			winston.warm('Unimplemented Application')
			break;
	}

	const twiml = new MessagingResponse()
	twiml.message(encode(reply))

	res.writeHead(200, {'Content-Type': 'text/xml'})
	res.end(twiml.toString())
})

function decode(str) { return str }
function encode(str) { return str }

app.listen(PORT, () => {
	winston.info('Express @ localhost:%d', PORT)
})