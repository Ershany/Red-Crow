const attr = ['auth', 'app', 'msg', 'gzip'] // TODO: make this a static const of TextMessage
const apps = ['Search', 'Website', 'News', 'Lyrics']
const hsize = attr.length
const maxsize = 1400

let error_codes = require('./util/error_codes')

class TextMessage {

	constructor(twilio) {
		if(typeof twilio === 'object') {
			const q = twilio.Body

			this.number = twilio.From || 'HTTP'
			this.buildHeader(q.slice(0, hsize))
			this.body = q.substring(hsize)
		}
	}

	// TODO: make a seperate FROM and TO buildHeader
	buildHeader(str) {
		for(let i in attr)
			this[attr[i]] = str.charAt(i)
	}

	// 8300Lyrics-Not-Found
	build(str) {
		let header =  str.slice(0, hsize)
		let s = str.substring(hsize)
		this.number = '+16138214472'
		this.buildHeader(header)
		this.body = s
	}

	hasCompleteHeader() {
		for(let i of attr) {
			if(!this[i]) {
				console.log('missing', i)
				return false
			}
		}
		return true
	}

	toString() {
		let str = ''

		for(let i of attr) {
			str += this[i]
		}

		str += this.body
		return str // TODO: slice off anything longer than maxsize
	}

	print() {
		let str = ''

		str += this.number + ': '
		str += apps[this.app]
		if(this.isCompressed())
			str += ' [GZIP]'

		str += ' {' + this.body + '}'
		return str
	}

	isCompressed() {
		return this.gzip != 0
	}

	hasError() {
		return this.auth != 0
	}
}

exports.TextMessage = TextMessage