import {expect} from 'chai'
import {AllureInterface, ContentType, Severity} from 'allure2-js-commons'

declare const allure: AllureInterface;

/* Playing around with second allure */
describe('Suite 1 allure 2', () => {
  it('Test 1  allure 2. With link', function () {
    expect(true).eq(true, 'True should be true')
    allure.addLink('Link name', `www.com`)
  })

  it(`Test 2  allure 2 Flaky`, () => {
    allure.setFlaky()
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 3  allure 2 Known`, () => {
    allure.setKnown()
    expect(true).eq(true, 'True should be true')
  })

  xit(`Test 4  allure 2 Muted`, () => {
    allure.setMuted()
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 5  allure 2 addOwner`, () => {
    allure.addOwner('This is the test owner')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 5  allure 2 severity`, () => {
    /*BLOCKER = "blocker",
    CRITICAL = "critical",
    NORMAL = "normal",
    MINOR = "minor",
    TRIVIAL = "trivial"*/
    allure.setSeverity(Severity.NORMAL)
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 6  allure 2 addIssue`, () => {
    allure.addIssue('This is test issue')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 7  allure 2 addTag`, () => {
    allure.addTag('This_is_test_tag')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 8  allure 2 addTestType`, () => {
    allure.addTestType('This_is_test_type')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 9  allure 2 step`, () => {
    allure.step('This is step', () => {
      allure.attachment('Text attachment', `This is attachent content`, ContentType.TEXT)
    })
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 10  allure 2 addParameter`, () => {
    allure.addParameter('Parameter_Name', 'Parameter_Value')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 10  allure 2 setDescription`, () => {
    allure.setDescription('This is test description')
    expect(true).eq(true, 'True should be true')
  })

  it(`Test 10  allure 2 addEnvironment`, () => {
    allure.addEnvironment('From test', 'Value')
    expect(true).eq(true, 'True should be true')
  })
})
