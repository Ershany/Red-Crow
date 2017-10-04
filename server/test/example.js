const assert = require('chai').assert

describe('Math Module', () => {
	it('should add numbers', () => {

		assert.equal( (1 + 1), '2')
		assert.strictEqual( 127 + 319, 446)
	})
})