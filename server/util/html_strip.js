module.exports = function(html) {
	return html.replace(/<.*?>/g, '')
		.replace(/\t|\r/g, '')
		.replace(/(\n)+/g, '\n')
		.replace(/( )+/g, ' ')
}