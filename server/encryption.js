'use strict'

let exec = require('child_process').exec

const bin_dir = 'java_files.' // ./bin/ do i need to specify package for this to work

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
	// console.log('encrypted shit you sent:', req.query.Body)
	if(req.Encryption) {
		decode(req.query.Body, 999, (err, stdout, stderr) => {
			// console.log('shit you actually sent:', stdout)
			req.query.Body = stdout
			next()
		})
	} else
		next()
}

function encrypt(req, res, next) {
	// console.log('shit you want:', res.Body)
	// TODO: don't encode the xml tags
	encode(res.Body, 999, (err, stdout, stderr) => {
		// console.log('encrypted shit you get:', stdout)
		// console.log(res.Body.substring(0, 57))
		// console.log(stdout.slice(58, -23))
		// console.log(res.Body.slice(-21))
		// res.end(res.Body.substring(0, 57) + stdout.slice(58, -23) + res.Body.slice(-21))
		// log.info('Sent', (header + str.toString()).length, 'bytes to', number)
		res.end(stdout)
	})
}

module.exports = { decrypt, encrypt }