'use strict'

process.env.NODE_ENV = 'test';

let chai = require('chai')
let assert = chai.assert
let should = chai.should()

let news = require('../features/news')

let reddits = [
	'trees',
	'worldnews'
]

describe('News Application', () => {

	for(let reddit of reddits) {
		it(`should get the news for: ${reddit}`, (done) => {
			news(reddit, (err, data) => {
				
				assert.typeOf(data, 'string')
				done()
			})
		})
	}
})