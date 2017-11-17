'use strict'

let exec = require('child_process').exec

const bin_dir = 'java_files.' // ./bin/ do i need to specify package for this to work

function encode(str, num, done) {
	str = str.replace(/"/g, '\'').replace(/\n/g, '---')
	// TODO: cannot have new lines in str
	// TODO: java doesn't play nice with unicode in an argument, replace character

	let cmd = `java ${bin_dir}Encrypt ${num} "${str}"`
	// let cmd = `java ${bin_dir}Encryption -e "${str}" ${num}`
	exec(cmd, done)
}

function decode(str, num, done) {	
	str = str.replace(/"/g, '\'')

	let cmd = `java ${bin_dir}Decrypt ${num} "${str}"`
	// let cmd = `java ${bin_dir}Encryption -d "${str}" ${num}`
	exec(cmd, done)
}

module.exports = { decode, encode }