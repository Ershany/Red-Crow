'use strict'

const PORT = 9001
let express = require('express')
let compression = require('compression')
let log = require('./log')
let dbms = require('./dbms')
let sms = require('./routes/sms')

let app = express()

const ERRORS = [
	{ code: 1 << 0, message: 'Check Byte Fail' },
	{ code: 1 << 1, message: 'No Query Received' },
	{ code: 1 << 2, message: 'Received Insufficient Data' },
	{ code: 1 << 3, message: 'Unimplemented Application' }
]

app.use(compression())

dbms.connect('mysql://root:potato@localhost/smsblitz')

app.route('/sms')
	.get(sms.getSMS)

app.listen(PORT, () => {
	log.info('Express @ localhost:%d', PORT)
})

module.exports = {
	sayHello: () => {
		return 'hello'
	},
	addNumbers: (a, b) => {
		return a + b
	}
}