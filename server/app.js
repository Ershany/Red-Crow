const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const app = express()

// Change to a POST request?
app.get('/sms', (req, res) => {
	// Add colours to logger
	// 17:36:08 - Received SMS: Heyo
	console.log(new Date().toLocaleTimeString(), '- Received SMS:', req.query.Body)
	console.log(req.query)

	const twiml = new MessagingResponse()
	twiml.message('Unknown Command.')

	res.writeHead(200, {'Content-Type': 'text/xml'})
	res.end(twiml.toString())
})

app.listen(9001, () => {
	console.log('Express @ localhost:9001')
})