// tslint:disable-next-line
const Jasmine = require('jasmine')
import * as AllureReporter from 'jasmine-allure-reporter'
import {AllureInterface, JasmineAllureReporter, AllureRuntime} from 'jasmine-allure2-reporter'
import {setPropertiesToReport} from './report_helpers'

const args = process.argv; /* TODO: MAKE A START TEST FILE */
const jasmineRun = new Jasmine()
const allure2reporter = new JasmineAllureReporter(new AllureRuntime({resultsDir: './allure2-results'}));
const allure1reporter = new AllureReporter({resultsDir: './allure1-results'})
export const allure: AllureInterface = allure2reporter.getInterface();

jasmineRun.jasmine.DEFAULT_TIMEOUT_INTERVAL = 5_000
jasmineRun.loadConfig({
  spec_dir: 'spec',
  spec_files: ['**/*.spec.*'],
  helpers: ['../report_helpers/jasmine.afterAll.*'],
  random: false,
  seed: null,
  stopSpecOnExpectationFailure: false,
})

jasmineRun.addReporter(args.includes('allure1') ? allure1reporter : allure2reporter);
jasmineRun.onComplete(() => setPropertiesToReport())

jasmineRun.execute()
