'use strict'

let fs = require('fs')
let base91 = require('base91')
let exec = require('child_process').exec

const bin_dir = 'java_files.'

// TODO: make it work with new lines, better yet change newlines to something else
function gzipCompress(str, file, done) {
	const input = `tmp/${file}.txt`
	const output = `tmp/${file}.txt.gz`
	const cmd = `java ${bin_dir}GzipProgram -c ${input} ${output}`

	fs.writeFile(input, str, (err) => {
		// TODO: allow the directory to be created as well, since git won't upload an empty folder
		if(err)
			throw err

		exec(cmd, (err) => {
			if(err)
				throw err

			fs.readFile(output, done)
		})
	})
}

function compress(req, res, next) {
	// TODO: get a better way to skip this middleware
	if(req.SMS.gzip == 0 || res.SMS.auth != 0) // res.SMS.auth in this case is the error code
		return next()

	// TODO: better way to name these files (application specific?)
	let filename = req.SMS.body.replace(/\//g, '-').replace(/\s/g, '_').toLowerCase()
	gzipCompress(res.SMS.body, `${req.SMS.app}/${filename}`, (err, data) => {
		if(err)
			throw err
		// TODO: only compress if the size is smaller, reset req.Compression to false
		res.SMS.body = base91.encode(data) // data.toString('base64')
		next()
	})
}

module.exports = { compress }