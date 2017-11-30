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

let fs = require('fs') // TODO: remove this testing dependency
const file = 'daft.txt'

function compressLocal(str, done) {
	// write $file to a file
	fs.writeFile(file, str, (err) => {
		if(err)
			throw err
		const cmd = `java ${bin_dir}GzipProgram -c "${file}"`
		exec(cmd, done)
	})
}

function compress(req, res, next) {
	// console.log('uncompressed shit you want:', res.Body)
	compressLocal(res.Body, (err, stdout, stderr) => {
		// console.log('compressed shit you get:', stdout)
		res.end(stdout)
	})
}

// compressLocal(file, (err) => { // removed stdout, stderr (not used)
// 	if(err)
// 		throw err

// 	// gz file is written to the local tmp folder
// 	// console.log('stdout:', stdout)
// 	// console.log('stderr:', stderr)
// 	fs.readFile('./tmp/' + file + '.gz', (err, data) => {
// 		if(err)
// 			throw err

// 		console.log('here:', data.toString(), ':end')
// 	})
// })

module.exports = { decrypt, encrypt, compressLocal }