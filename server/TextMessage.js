const attr = ['auth', 'app', 'msg', 'crpt', 'gzip'] // TODO: make this a static const of TextMessage
const hsize = attr.length

class TextMessage {

	constructor(twilio) {
		// TODO: have a way to build an sms from string ex: 83000Lyrics-Not-Found
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
}

// TODO: add to a testing file
let a = new TextMessage({
	To: '+16139099701',
	ToZip: '',
	ToCity: '',
	ToState: 'Ottawa',
	ToCountry: 'CA',

	From: '+16137954472',
	FromZip: 'K4P 1B8',
	FromCity: 'OTTAWA',
	FromState: 'ON',
	FromCountry: 'CA',

	NumSegments: '1',
	NumMedia: '0',
	SmsStatus: 'received',
	Body: 'E1059micmax.pw',

	ApiVersion: '2010-04-01',
	SmsMessageSid: 'SM7569e58955f48ada625b525ce9e20bf3',
	SmsSid: 'SM7569e58955f48ada625b525ce9e20bf3',
	MessageSid: 'SM7569e58955f48ada625b525ce9e20bf3',
	AccountSid: 'AC0dc468231e18755eceb21fb5ed57a861'
})

// console.log(a)
// console.log(a.toString())

exports.TextMessage = TextMessage