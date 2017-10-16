var fs = require('fs')

function replySMS(message, done) {
	let error_code = 0
	let reply = 'empty'

	if(message.auth != 69) {
		error_code = 1
		reply = 'Unauthorized Token'
	}

	switch(message.app_id) {
		case 0:
			googleSearch(message.body)
			break;
		case 1:
			webpageFetch(message.body)
			break;
		default:
			error_code = 2
			reply = 'Unimplemented Application'
			break;
	}

	function googleSearch(query) {
		fs.readFile(query, function (err, results) {
			if(err) 
				return done(err)
			done(null, results)
		})
	}

	function webpageFetch(url) {
		done(null, 'webpage')
	}
}

let message = {
	auth: 69,
	app_id: 0,
	msg_id: 0,
	body: 'async_callbacks/TheBeatles.txt'
}

replySMS(message, function(err, res) {
	if(err)
		console.log(err) // no sms sent
	console.log(res.toString())
	return res.toString()
	// sendEncodedSMS(res.toString())
})

console.log('Reply', reply)