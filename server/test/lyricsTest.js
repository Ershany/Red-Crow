'use strict'

process.env.NODE_ENV = 'test';

let chai = require('chai')
let assert = chai.assert
let should = chai.should()

let lyrics = require('../features/lyrics')

let songs = [
	'Russ/Psycho, Pt. 2',
	'XXXTentacion/Depression & Obsession'
]

// function lyricCB(err, data, done) {
// 	if(err)
// 		throw err
	
// 	assert.typeOf(data, 'string')
// }

describe('Lyrics Application', () => {

	for(let song of songs) {
		it(`should get lyrics to: ${song}`, (done) => {
			lyrics(song, (err, data) => {
				
				assert.typeOf(data, 'string')
				done()
			})
		})
	}
})