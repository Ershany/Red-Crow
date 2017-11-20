'use strict'

let cheerio = require('cheerio')
let request = require('request')

function lyrics(sms, done) {
	const lyricsLink = sms.toLowerCase().replace(/[\s,.]/g, '')
	const link = `https://www.azlyrics.com/lyrics/${lyricsLink}.html`

	// TODO: check if link is a valid url before doing the request
	// for example more than one '/'  (might change the seperating character)
	request(link, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			let $ = cheerio.load(body)
			const rawData = $('div').eq(21).text().trim()
			done(null, rawData)
		} else {
			done(8)
		}
	})
}

// TODO: move this to testing
// lyrics('Russ/Psycho, Pt. 2', (err, data) => {
// 	if(err)
// 		throw err
// 	console.log(data)
// })

module.exports = lyrics