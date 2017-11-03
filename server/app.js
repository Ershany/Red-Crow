'use strict'

let express = require('express')

let log = require('./log')
let dbms = require('./dbms')
let sms = require('./routes/sms')
let config = require('./config')

const PORT = config.port
let app = express()

dbms.connect(config.database)

app.route('/sms').get(sms.getSMS)

app.listen(PORT, () => {
	log.info('Express @ localhost:%d', PORT)
})