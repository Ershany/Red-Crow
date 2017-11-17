'use strict'

process.env.NODE_ENV = 'test';

let chai = require('chai')
let encode = require('../encryption').encode
let decode = require('../encryption').decode

let assert = chai.assert
let should = chai.should()

let beatlesSearch = 'The Beatles'
let beatlesCoded = 'seltae666B ehT' // TODO: replace with actual result
let beatlesEncode = encode(beatlesSearch, 666)
let beatlesDecode = decode(beatlesCoded, 666)

describe('Encryption', () => {
	// TODO: add tests for
	// long strings
	// with weird chars (newlines, tabs, unicode)
	// empty strings
	// check that size shrinks when encoding, because it should compress it too

	describe('Encoding', () => {

		it(`should encode: ${beatlesSearch} using 666`, (done) => {
			encode(beatlesSearch, 666, (err, stdout, stderr) => {
				assert.typeOf(stdout, 'string')
				// assert.equal(stdout, beatlesCoded)
				done()
			})
		})
	})

	describe('Decoding', () => {

		it('should decode: seltae666B ehT using 666', (done) => {
			decode(beatlesCoded, 666, (err, stdout, stderr) => {
				assert.typeOf(stdout, 'string')
				// assert.equal(stdout, beatlesSearch)
				done()
			})
		})
	})

	describe('Encoding <---> Decoding', () => {

		it('should decode the encoded value of hello to get hello back', (done) => {
			let str1 = 'hello'
			encode(str1, 999, (err, stdout, stderr) => {
				decode(stdout, 666, (err, stdout, stderr) => {
					assert.equal(stdout, str1)
					done()
				})
				// decode with different number and it shouldn't work
			})
		})

		// str = 'hello'
		// de = decode(str)
		// en = encode(de)
		// assert.equal(str, en)

		// assert.equal(checkEncodeEqualDecode('lady in the yellow', true))
	})
})

// function checkEncodeEqualDecode(str) {
// 	let en = encode(str)
// 	let de = decode(en)

// 	return de === str
// }