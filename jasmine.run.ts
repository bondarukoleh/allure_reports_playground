// tslint:disable-next-line
const Jasmine = require('jasmine')
import * as AllureReporter from 'jasmine-allure-reporter'

const jasmineRun = new Jasmine()
jasmineRun.jasmine.DEFAULT_TIMEOUT_INTERVAL = 5_000

jasmineRun.loadConfig({
  spec_dir: 'spec',
  spec_files: ['*.spec.*'],
  random: false,
  seed: null,
  stopSpecOnExpectationFailure: false,
})

jasmineRun.addReporter(new AllureReporter())

jasmineRun.execute()
