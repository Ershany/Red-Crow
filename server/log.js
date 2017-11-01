'use strict'

let winston = require('winston')
let config = require('winston/lib/winston/config');

let log = new winston.Logger

if(process.env.NODE_ENV !== 'test') {
	log.add(winston.transports.Console, {
		timestamp: () => {
			return new Date().toLocaleTimeString()
		},
		formatter: (options) => {
			return options.timestamp() + ' ' +
			config.colorize(options.level, options.level.toUpperCase()) + ' ' +
			(options.message ? options.message : '') +
			(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' )
		}
	})
}

module.exports = log