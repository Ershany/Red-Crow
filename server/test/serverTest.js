let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

chai.use(chaiHttp)

describe('App', () => {
	// beforeEach((done) => {
	// 	Book.remove({}, (err) => {
	// 		done()
	// 	})
	// })

	describe('/GET sms', () => {

		it('should perform a google search for The Beatles', (done) => {
			chai.request(server)
			.get('/sms?Body=E00The Beatles')
			.end((err, res) => {
				res.should.have.status(200)
				res.body.should.be.a('array')
				res.body.length.should.be.eql(0)
				done()
			})
		})
	})
})