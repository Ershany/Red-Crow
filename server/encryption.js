'use strict'

let exec = require('child_process').exec

const bin_folder = '' // ./bin/ do i need to specify package for this to work

function encode(str, num, done) {
	let cmd = 'java Encryption -e ${str} ${num}'
	exec(cmd, done)
}

function decode(str, num, done) {
	let cmd = 'java Encryption -d ${str} ${num}'
	exec(cmd, done)
}

encode("hello", 472, (err, stdout, stderr) => {
	console.log('error: %s\nstdout: %s\nstderr: %s', err, stdout, stderr)
})

decode("hello", 472, (err, stdout, stderr) => {
	console.log('error: %s\nstdout: %s\nstderr: %s', err, stdout, stderr)
})

module.exports = { decode, encode }