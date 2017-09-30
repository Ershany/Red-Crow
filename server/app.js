'use strict'

const compression = require('compression')
const orm = require('orm')
const MigrateTask = require('migrate-orm2')
const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const log = require('./log')

const PORT = 9001
const app = express()

const ERROR_CODES = {
	CHECK_BYTE: 1,
	DATA: 2
}

app.use(compression())

// google search api key: AIzaSyD62XwkP-5dwJ6eaewoySIqfYvjctvAGKs

// TODO: Add foreign key relationships
orm.connect('mysql://root:potato@localhost/smsblitz', (err, db) => {
	if(err) throw err
	log.info('Connected to MySQL Database')
	var task = new MigrateTask(db.driver);
	log.info("Migration framework initialized for Node ORM")
	
	// Define tables
	var User = db.define('User', {
		id: { type: 'serial', key: true },
		phonenumber: { type: 'text', size: 20, required: true, index: true }, // unique: true
		blacklisted: { type: 'boolean', defaultValue: false }
	})
	
	var Message = db.define('Message', {
		id: { type: 'serial', key: true },
		timestamp: { type: 'date', time: true, required: true, defaultValue: new Date() }
	})
	
	var ServerSearchMessage = db.define('ServerSearchMessage', {
		id: { type: 'serial', key: true },
		response: { type: 'text', required: true }
	})
	ServerSearchMessage.hasOne('message', Message, {required: true});
	
	var ClientSearchMessage = db.define('ClientSearchMessage', {
		id: { type: 'serial', key: true },
		query: { type: 'text', required: true }
	})
	ClientSearchMessage.hasOne('message', Message, {required: true});
	
	// Add tables to the db
	db.sync((err) => {
		if(err) throw err
		
		// Add row just for testing
		// User.create({ phonenumber: '613-633-0136'}, (err) => {
		// 	if(err) throw err
		// })
		// Message.create({}, (err) => {
		// 	if(err) throw err
		// })
	})
})

app.get('/sms', (req, res) => {
	log.info('Received SMS:', req.query.Body)
	// log.info(req.query)

	if(!(req && req.query && req.query.Body)) {
		log.warn('No Query Received')
		return res.sendStatus(500)
	}

	var decoded = decode(req.query.Body)

	if(decoded.length < 4) {
		log.warn('Received Insufficient Data')
		return res.sendStatus(500)
	}

	if(!decoded.startsWith('E')) {
		log.warn('Check Byte Fail')
		return res.sendStatus(500)
	}

	let app_id = decoded.charAt(1) // charCodeAt
	let msg_id = decoded.charCodeAt(2)
	let msg_body = decoded.substr(3)
	let reply = 'Unknown Command'
	switch(app_id) {
		case '0': // 0
			log.info('Google Search Request: %s', msg_body)
			reply = 'cats are great, ' + msg_body
			break;
		default:
			log.warn('Unimplemented Application')
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
	log.info('Express @ localhost:%d', PORT)
})