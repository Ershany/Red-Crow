'use strict'

process.env.NODE_ENV = 'test';

let chai = require('chai')
let chaiHttp = require('chai-http')
let parseString = require('xml2js').parseString
let app = require('../app')

let assert = chai.assert
let should = chai.should()

chai.use(chaiHttp)

describe('App', () => {
	describe('/GET sms', () => {

		// test cases to add:
		// to sms/Body= (empty message)
		// just to /sms
		// app id's that dont exist

		it('should perform a google search for: The Beatles', (done) => {
			let incomingSMS = {
				auth: 'E',
				app: 0,
				msg: 0,
				body: 'The Beatles'
			}
			chai.request('localhost:9001')
			.get('/sms?Body=' + smsToText(incomingSMS))
			.end((err, res) => {
				parseString(res.text, (err, res) => {
					if(err)
						throw err
					let text = res.Response.Message[0]
					let sms = textToSMSObj(text)
					let bodyLines = sms.body.split(/\n/)
					
					assert.equal(sms.err, 0)
					assert.equal(sms.app, 0)
					assert.equal(sms.msg, 0)

					// assert.typeOf(sms.err, 'number')
					// assert.typeOf(sms.app, 'number')
					// assert.typeOf(sms.msg, 'number')

					assert.typeOf(sms.body, 'string')
					assert.isAbove(sms.body.length, 0)
					assert.isBelow(sms.body.length, 2000) // 2k char limit
					// assert.lengthOf(bodyLines, 9) // 3 queries, 3 lines each

					// for(let line of bodyLines) {
					// 	assert.typeOf(line, 'string')
					// 	assert.isAbove(line.length, 0)
					// }
				})

				res.should.have.status(200)
				done()
			})
		})
	})
})

function textToSMSObj(str) {
	return {
		err: str.charAt(0),
		app: str.charAt(1),
		msg: str.charAt(2),
		body: str.substring(3)
	}
}

function smsToText(sms) {
	return sms.auth + sms.app + sms.msg + sms.body
}