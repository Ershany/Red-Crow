const orm = require('orm')
const log = require('./log')
const MigrateTask = require('migrate-orm2')

// TODO: Add foreign key relationships

function connect(dbString) {
	// TODO: had to 'create database smsblitz;' manually
	orm.connect(dbString, (err, db) => {	
		if(err) throw err
		log.info('Connected to MySQL Database - %s', dbString)
		var task = new MigrateTask(db.driver)
		log.info("Migration framework initialized for Node ORM")
		
		// Define tables
		var User = db.define('User', {
			id: { type: 'serial', key: true },
			phonenumber: { type: 'text', size: 20, required: true, index: true }, // unique: true
			blacklisted: { type: 'boolean', defaultValue: false }
		})
		
		var Message = db.define('Message', {
			id: { type: 'serial', key: true },
			timestamp: { type: 'date', time: true, required: true, defaultValue: new Date() }
		})
		
		var ServerSearchMessage = db.define('ServerSearchMessage', {
			id: { type: 'serial', key: true },
			response: { type: 'text', required: true }
		})
		ServerSearchMessage.hasOne('message', Message, {required: true})
		
		var ClientSearchMessage = db.define('ClientSearchMessage', {
			id: { type: 'serial', key: true },
			query: { type: 'text', required: true }
		})
		ClientSearchMessage.hasOne('message', Message, {required: true})
		
		// Add tables to the db
		db.sync((err) => {
			if(err) throw err
			
			// Add row just for testing
			// User.create({ phonenumber: '613-633-0136'}, (err) => {
			// 	if(err) throw err
			// })
			// Message.create({}, (err) => {
			// 	if(err) throw err
			// })
		})
	})
}

module.exports.connect = connect