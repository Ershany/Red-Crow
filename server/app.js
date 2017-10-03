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
	var task = new MigrateTask(db.driver)
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
	ServerSearchMessage.hasOne('message', Message, {required: true})
	
	var ClientSearchMessage = db.define('ClientSearchMessage', {
		id: { type: 'serial', key: true },
		query: { type: 'text', required: true }
	})
	ClientSearchMessage.hasOne('message', Message, {required: true})
	
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

	let err_code = 0

	if(!(req && req.query && req.query.Body)) {
		log.warn('No Query Received')
		err_code |= 1 << 0
		return res.sendStatus(500)
	}

	var decoded = decode(req.query.Body)
	let app_id = decoded.charAt(1) // charCodeAt
	let msg_id = decoded.charCodeAt(2)
	let msg_body = decoded.substr(3)

	if(decoded.length < 4) {
		log.warn('Received Insufficient Data')
		err_code |= 1 << 1
		// TODO: don't return before sending reply to phone
		return res.sendStatus(500)
	}

	if(!decoded.startsWith('E')) {
		log.warn('Check Byte Fail')
		err_code |= 1 << 2
		return res.sendStatus(500)
	}

	let reply = 'Unknown Command'

	switch(app_id) {
		case '0': // 0
			log.info('Google Search Request: %s', msg_body)
			// TODO: google search here
			let replyJSON = {
				links: [
					{t: 'title1', u: 'url1', d: 'description1'},
					{t: 'title2', u: 'url2', d: 'description2'},
					{t: 'title3', u: 'url3', d: 'description3'},
					{t: 'title4', u: 'url4', d: 'description4'},
					{t: 'title5', u: 'url5', d: 'description5'},
				]
			}
			reply = JSON.stringify(replyJSON)
			break
		case '1': // 1
			log.info('Webpage Request: %s', msg_body)
			reply = 'webpages use too much data :)'
			break
		default:
			log.warn('Unimplemented Application')
			err_code |= 1 << 3
			break
	}

	const twiml = new MessagingResponse()
	const text_reply = encode(app_id + msg_id + err_code + reply)
	twiml.message(text_reply)
	res.writeHead(200, {'Content-Type': 'text/xml'})
	res.end(twiml.toString())

	lon.info('Sent %d bytes to user %d', text_reply.length, 6137954472) // TODO: get actual number
})

function decode(str) { return str }
function encode(str) { return str }

app.listen(PORT, () => {
	log.info('Express @ localhost:%d', PORT)
})