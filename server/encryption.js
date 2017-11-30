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
	if(!req.Encryption)
		return next()

	// console.log('encrypted shit you sent:', req.query.Body)
	decode(req.query.Body, 999, (err, stdout, stderr) => {
		if(err)
			throw err
		// console.log('shit you actually sent:', stdout)
		req.query.Body = stdout
		next()
	})
}

function encrypt(req, res, next) {
	if(!req.Encryption)
		return next()

	// console.log('shit you want:', res.Body)
	encode(res.Body, 999, (err, stdout, stderr) => {
		if(err)
			throw err
		// console.log('encrypted shit you get:', stdout)
		res.Body = stdout
		next()
	})
}

module.exports = { decrypt, encrypt }