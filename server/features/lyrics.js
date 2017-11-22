'use strict'

let cheerio = require('cheerio')
let request = require('request')

function lyrics(sms, done) {
	if(!sms)
		return done(1)

	if((sms.match(/\//g) || []).length != 1)
		return done(10)

	const lyricsLink = sms.toLowerCase().replace(/[^a-z0-9/]/g, '')
	const link = `https://www.azlyrics.com/lyrics/${lyricsLink}.html`

	// TODO: check if link is a valid url before doing the request
	// for example more than one '/'  (might change the seperating character)
	console.log('lyric request to', link)
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

function lyricCB(err, data) {
	if(err)
		throw err
	console.log(data)
}

// TODO: move this to testing
// lyrics('Russ/Psycho, Pt. 2', lyricCB)
// lyrics('XXXTentacion/Depression & Obsession', lyricCB)

module.exports = lyrics