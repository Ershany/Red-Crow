let cheerio = require('cheerio')

module.exports = function(html) {
	let $ = cheerio.load(html)
	return $('body').text()
		.replace(/(\n\s*)+/g, '\n')
		.replace(/\t|\r/g, '')
		.replace(/( )+/g, ' ')
}