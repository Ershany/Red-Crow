'use strict'

function convertErrorCode(x) {
	let y = x || 0

	if(x >= 36) {
		x -= 36
		y = String.fromCharCode(x + 'A'.charCodeAt(0))
	} else if(x >= 10) {
		x -= 10
		y = String.fromCharCode(x + 'a'.charCodeAt(0))
	}

	return y
}

// TODO: move to a testing file
// for(let i = 0; i < 62; i++)
// 	console.log(convertErrorCode(i))

module.exports = convertErrorCode