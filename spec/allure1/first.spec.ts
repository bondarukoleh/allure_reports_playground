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
    allure.addEnvironment('Variable from test', 'yes')
    expect(true).eq(true, 'True should be true')
  })
})
