'use strict'

let express = require('express')

let log = require('./log')
let dbms = require('./dbms')
let sms = require('./routes/sms')

const PORT = 9001
let app = express()

dbms.connect('mysql://root:potato@localhost/smsblitz')

app.route('/sms').get(sms.getSMS)

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