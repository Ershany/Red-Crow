'use strict'

process.env.NODE_ENV = 'test';

let chai = require('chai')
let assert = chai.assert
let should = chai.should()

var { TextMessage } = require('../TextMessage');

describe('Text Message', () => {
	
})

// let a = new TextMessage({
// 	To: '+16139099701',
// 	ToZip: '',
// 	ToCity: '',
// 	ToState: 'Ottawa',
// 	ToCountry: 'CA',

// 	From: '+16137954472',
// 	FromZip: 'K4P 1B8',
// 	FromCity: 'OTTAWA',
// 	FromState: 'ON',
// 	FromCountry: 'CA',

// 	NumSegments: '1',
// 	NumMedia: '0',
// 	SmsStatus: 'received',
// 	Body: 'E1059micmax.pw',

// 	ApiVersion: '2010-04-01',
// 	SmsMessageSid: 'SM7569e58955f48ada625b525ce9e20bf3',
// 	SmsSid: 'SM7569e58955f48ada625b525ce9e20bf3',
// 	MessageSid: 'SM7569e58955f48ada625b525ce9e20bf3',
// 	AccountSid: 'AC0dc468231e18755eceb21fb5ed57a861'
// })

// console.log(a)
// console.log(a.toString())