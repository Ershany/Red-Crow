'use strict'

let express = require('express')
let sms = require('./routes/sms')

const PORT = 9001
let app = express()

app.use((req, res, next) => {
	console.log(req.method, ':', req.url)
	next()
})

app.route('/sms').get(sms)

app.listen(PORT, () => {
	console.log('Express @ localhost:%d', PORT)
})