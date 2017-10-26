'use strict'

let winston = require('winston')
let config = require('winston/lib/winston/config');

let log = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			timestamp: () => {
				return new Date().toLocaleTimeString()
			},

			// - Return string will be passed to logger.
			// - Optionally, use config.colorize(options.level, <string>) to
			//   colorize output based on the log level.
			formatter: (options) => {
				return options.timestamp() + ' ' +
				config.colorize(options.level, options.level.toUpperCase()) + ' ' +
				(options.message ? options.message : '') +
				(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' )
			}
		})
	]
})

module.exports = log