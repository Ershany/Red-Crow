'use strict'

let exec = require('child_process').exec
const bin_dir = 'java_files.'

// TODO: make it work with new lines, better yet change newlines to something else
function gzipCompress(str, done) {
	const cmd = `java ${bin_dir}GzipProgram -c "${str}"`
	exec(cmd, done)
}

// Only need compress on the server for now, since the requests are < 160 chars anyways
function compress(req, res, next) {
	if(!req.Compression)
		return next()

	// console.log('shit to shrink:', res.Body)
	gzipCompress(res.Body, (err, stdout, stderr) => {
		if(err)
			throw err
		// console.log('compressed shit you get:', stdout)
		res.Body = stdout
		next()
	})
}

module.exports = { compress }