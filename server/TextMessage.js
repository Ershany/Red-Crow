const attr = ['auth', 'app', 'msg', 'crpt', 'gzip'] // TODO: make this a static const of TextMessage
const apps = ['Search', 'Website', 'News', 'Lyrics']
const hsize = attr.length

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

	// 83000Lyrics-Not-Found
	build(str) {
		this.number = '+16138214472'
		this.buildHeader(str.slice(0, hsize))
		this.body = str.substring(hsize)
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

		for(let i of attr)
			str += this[i]

		str += this.body
		return str
	}

	print() {
		let str = ''

		str += this.number + ': '
		str += apps[this.app]
		if(this.crpt != 0)
			str += ' [CRPT]'
		if(this.gzip != 0)
			str += ' [GZIP]'

		str += ' {' + this.body + '}'
		return str
	}
}

exports.TextMessage = TextMessage