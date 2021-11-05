import {expect} from 'chai'
declare const allure;

/* Playing around with first allure */

describe('Suite 2', () => {
  it(`Test 5`, () => {
    allure.description('This is test description', 'text')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 6`, () => {
    // BLOCKER: 'blocker',
    // CRITICAL: 'critical',
    // NORMAL: 'normal',
    // MINOR: 'minor',
    // TRIVIAL: 'trivial'
    allure.description('mark down desc', 'markdown')
    allure.severity('blocker')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 7 (broken)`, () => {
    // statuses:  ['passed', 'pending', 'skipped', 'failed', 'broken']
    allure.epic('EPIC VALUE')
    allure._allure.startStep('Broken Step')
    allure._allure.endStep('broken')
    allure._allure.endCase('broken', new Error('Waiter problem'))
  })

  xit('Test 8 (skipped)', () => {})

  it('Test 9 (failed)', () => {
    expect(true).eq(false, 'True should be true')
  })

  it(`Test 10 addLabel testId`, () => {
    allure.addLabel('testId', '123');
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 11 addLabel issue`, () => {
    allure.addLabel('issue', 'ISSUE-123');
    expect(true).eq(true, 'True should be true')
  })
})
