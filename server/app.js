'use strict'

let express = require('express')

let log = require('./log')
let dbms = require('./dbms')
let sms = require('./routes/sms')
let config = require('./config')
let encryption = require('./encryption')
let compression = require('./compression')

var { TextMessage } = require('./TextMessage');

const PORT = config.port
let app = express()

dbms.connect(config.database)

app.get('/sms', (req, res, next) => {
	req.Encryption = config.encryption // req.SMS.crpt
	req.Compression = config.compression // req.SMS.gzip

	req.SMS = new TextMessage(req.query)
	res.SMS = new TextMessage()

	next()
}, encryption.decrypt, sms.smsHandler, compression.compress, encryption.encrypt, sms.smsSender)

app.listen(PORT, () => {
	log.info('Express @ localhost:%d', PORT)
})

// TODO: check if encryption is set in message header
// TODO: replace 999 with req.query.From (phone number)
// TODO: bypass encryption on when number is HTTP