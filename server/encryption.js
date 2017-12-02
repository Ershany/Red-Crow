'use strict'

let exec = require('child_process').exec
const bin_dir = 'java_files.'

function decode(str, num, done) {	
	str = str.replace(/"/g, '\'')

	// TODO: make encryption program in this format 'java Encryption -d str num'
	const cmd = `java ${bin_dir}Decrypt ${num} "${str}"`
	exec(cmd, done)
}

function encode(str, num, done) {
	str = str.replace(/"/g, '\'').replace(/\n/g, '---')
	// TODO: cannot have new lines in str
	// TODO: java doesn't play nice with unicode in an argument, replace character

	const cmd = `java ${bin_dir}Encrypt ${num} "${str}"`
	exec(cmd, done)
}

// TODO: replace 999 with req.SMS.number.slice(-3)
function decrypt(req, res, next) {
	if(req.SMS.crpt == 0)
		return next()

	decode(req.SMS.body, 999, (err, stdout, stderr) => {
		if(err)
			throw err
		req.SMS.body = stdout
		next()
	})
}

function encrypt(req, res, next) {
	if(req.SMS.crpt == 0)
		return next()

	encode(res.SMS.body, 999, (err, stdout, stderr) => {
		if(err)
			throw err
		res.SMS.body = stdout
		next()
	})
}

module.exports = { decrypt, encrypt }