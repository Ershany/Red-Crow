'use strict'

process.env.NODE_ENV = 'test';

let chai = require('chai')
let assert = chai.assert
let should = chai.should()

let webpage = require('../features/webpage')

let urls = [
	'micmax.pw',
	'ershany.github.io'
]

describe('Webpage Application', () => {

	for(let url of urls) {
		it(`should fetch the url: ${url}`, (done) => {
			webpage(url, (err, data) => {
				
				assert.typeOf(data, 'string')
				done()
			})
		})
	}
})