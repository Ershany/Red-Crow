var fs = require('fs')

function replySMS(message, done) {
	if(message.auth != 69)
		return done(null, 'Unauthorized Token')

	switch(message.app_id) {
		case 0:
			googleSearch(message.body)
			break;
		case 1:
			webpageFetch(message.body)
			break;
		default:
			done('Unimplemented Application')
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
	body: 'TheBeatles.txt'
}

replySMS(message, function(err, res) {
	if(err)
		return console.log(err) // error sms
	console.log(res.toString()) // worked sms
})