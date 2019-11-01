import {expect} from 'chai'
declare const allure;

/* Playing around with first allure */

describe('Suite 1', () => {
  it('Test 1', function () {
    console.log('\x1b[34mTest is running...\x1b[89m')
    expect(true).eq(true, 'True should be true')

    allure._allure.startStep('step  in it');
    allure.feature('FEATURE LABEL AAA');
    allure._allure.addAttachment('attachement', 'test content');
    allure._allure.endStep('passed');
  })

  it(`Test 2`, () => {
    allure.story('STORY LABEL AAA');
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 3`, () => {
    allure.addArgument('arg name', 'arg value')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 4`, () => {
    allure.addEnvironment('arg name', 'arg value')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 5`, () => {
    allure.description('text down desc', 'text')
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

  it('Test 8 (failed)', () => {
    expect(true).eq(false, 'True should be true')
  })
})
