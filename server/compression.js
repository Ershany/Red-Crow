'use strict'

let fs = require('fs')
let base91 = require('base91')
let exec = require('child_process').exec
let config = require('./config')

const bin_dir = 'java_files.'

// TODO: make it work with new lines, better yet change newlines to something else
function gzipCompress(str, file, done) {
	// 1. write res.Body to a file
	// 2. exec GzipProgram -c input.txt output.txt
	// 3. read output.txt and set res.Body to equal it
	// or... res.Body = gzip(res.Body) npm gzip module???
	const input = `tmp/${file}.txt`
	const output = `tmp/${file}.txt.gz`
	const cmd = `java ${bin_dir}GzipProgram -c ${input} ${output}`

	fs.writeFile(input, str, (err) => {
		// TODO: allow the directory to be created as well, since git won't upload an empty folder
		if(err)
			throw err

		exec(cmd, writeFile)
	})

	function writeFile(err) {
		if(err)
			throw err

		fs.readFile(output, done)
	}
}

// Only need compress on the server for now, since the requests are < 160 chars anyways
function compress(req, res, next) {
	// TODO: get a better way to skip this middleware
	// just checking res.Body's first character to see if it has an error for now
	if(!req.Compression || !res.Body.startsWith('0'))
		return next()

	// console.log('shit to shrink:', res.Body)
	// TODO: make a function in each module, that defines how these files get renamed
	// also could have a generic one i guess
	let body = req.query.Body.substring(config.header_size)
	const hsize = config.header_size
	let filename = body.replace(/\//g, '-').replace(/\s/g, '_').toLowerCase()
	gzipCompress(res.Body.substring(hsize), `${req.SMS.app}/${filename}`, (err, data) => {
		if(err)
			throw err
		// console.log('compressed shit you get:', stdout)
		// TODO: only compress if the size is smaller, reset req.Compression to false
		res.Body = res.Body.slice(0, hsize + 1) + base91.encode(data) // data.toString('base64')
		next()
	})
}

// TODO: add this to a test file
// gzipCompress('hello im just a string that needs to be wr', (err, data) => {
// 	if(err)
// 		throw err
// 	console.log(data)
// })

module.exports = { compress }