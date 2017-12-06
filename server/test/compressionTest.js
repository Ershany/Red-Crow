'use strict'

process.env.NODE_ENV = 'test';

let chai = require('chai')
let assert = chai.assert
let should = chai.should()

let compress = require('../compression')

describe('Compression', () => {
	
})

// gzipCompress('compress me like you suppress your emotions', 'sad.txt', (err, data) => {
// 	if(err)
// 		throw err
// 	console.log(data)
// })