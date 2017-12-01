'use strict'

let exec = require('child_process').exec
const bin_dir = 'java_files.'

function decode(str, num, done) {	
	str = str.replace(/"/g, '\'')

	const cmd = `java ${bin_dir}Decrypt ${num} "${str}"`
	// let cmd = `java ${bin_dir}Encryption -d "${str}" ${num}`
	exec(cmd, done)
}

function encode(str, num, done) {
	str = str.replace(/"/g, '\'').replace(/\n/g, '---')
	// TODO: cannot have new lines in str
	// TODO: java doesn't play nice with unicode in an argument, replace character

	const cmd = `java ${bin_dir}Encrypt ${num} "${str}"`
	// let cmd = `java ${bin_dir}Encryption -e "${str}" ${num}`
	exec(cmd, done)
}

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