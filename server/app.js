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
	req.SMS = new TextMessage(req.query)
	res.SMS = new TextMessage()

	next()
}, encryption.decrypt, sms.smsHandler, compression.compress, encryption.encrypt, sms.smsSender)

app.listen(PORT, () => {
	log.info('Express @ localhost:%d', PORT)
})