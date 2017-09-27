const mysql = require('mysql')
const orm = require('orm')
const express = require('express')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const app = express()

// TODO: Add foreign key relationships
orm.connect("mysql://root:potato@localhost/smsblitz", function (err, db) {
	if(err) throw err
	
	// Define tables
	var User = db.define("User", {
		id : { type: 'serial', key: true },
		phonenumber : { type: 'text', size: 20, required: true, index: true }, // unique: true
		blacklisted : { type: 'boolean', defaultValue: false }
	})
	
	var Message = db.define("Message", {
		id : { type: 'serial', key: true },
		timestamp : { type: 'date', time: true, required: true, defaultValue: new Date() }
	})
	
	var ServerSearchMessage = db.define("ServerSearchMessage", {
		id : { type: 'serial', key: true },
		response : { type: 'text', required: true }
	})
	ServerSearchMessage.hasOne("message", Message, {required: true});
	
	var ClientSearchMessage = db.define("ClientSearchMessage", {
		id : { type: 'serial', key: true },
		query : { type: 'text', required: true }
	})
	ClientSearchMessage.hasOne("message", Message, {required: true});
	
	// Add tables to the db
	db.sync(function(err) {
		if(err) throw err
		
		// Add row just for testing
		//User.create({ phonenumber: "613-633-0136"}, function(err) {
		//	if(err) throw err
		//})
		//Message.create({}, function(err) {
		//	if(err) throw err
		//})
	})
})


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