import {expect} from 'chai'

describe('Suite 1', () => {
  it('Test 1', function () {
    console.log('\x1b[34mTest is running...\x1b[89m')
    expect(true).eq(true, 'True should be true')
  })
})
