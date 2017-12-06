'use strict'

process.env.NODE_ENV = 'test';

let chai = require('chai')
let assert = chai.assert
let should = chai.should()

let search = require('../features/search')

let queries = [
	'The Beatles',
	'Baby Back Ribs'
]

describe('Search Application', () => {

	for(let query of queries) {
		it(`should perform search for: ${query}`, (done) => {
			search(query, (err, data) => {
				
				assert.typeOf(data, 'string')
				done()
			})
		})
	}
})