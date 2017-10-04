let chai = require('chai')
let chaiHttp = require('chai-http')
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
			chai.request('localhost:9001')
			.get('/sms?Body=E00The Beatles')
			.end((err, res) => {
				res.should.have.status(200)
				// check for same app_id
				// check for same msg_id
				// check error_code, should be 0
				// verify integrity of response body
				done()
			})
		})
	})
})