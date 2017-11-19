'use strict'

let express = require('express')

let log = require('./log')
let dbms = require('./dbms')
let sms = require('./routes/sms')
let config = require('./config')
let encryption = require('./encryption')

const PORT = config.port
let app = express()

dbms.connect(config.database)

app.get('/sms', (req, res, next) => {
	req.Encryption = config.encryption
	next()
}, encryption.decrypt, sms, encryption.encrypt)

app.listen(PORT, () => {
	log.info('Express @ localhost:%d', PORT)
})

// TODO: check if encryption is set in message header
// TODO: replace 999 with req.query.From (phone number)
// TODO: bypass encryption on when number is HTTP