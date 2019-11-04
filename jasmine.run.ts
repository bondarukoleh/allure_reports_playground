// tslint:disable-next-line
const Jasmine = require('jasmine')
import * as Allure1Reporter from 'jasmine-allure-reporter'
import {
  AllureInterface,
  JasmineAllureReporter as Allure2Reporter,
  AllureRuntime
} from 'jasmine-allure2-reporter'
import {setPropertiesToReport, copyHistoryFromReport, generateReport} from './report_helpers'
import * as argParser from 'minimist'
const {allureV} = argParser(process.argv)
const allureVersion = allureV
const jasmineRun = new Jasmine()
const reporterConfig = {resultsDir: `./allure${allureVersion}-results`}
const getAllure2reporter = () => {
  const allure2reporter = new Allure2Reporter(new AllureRuntime(reporterConfig))
  // @ts-ignore /* to have allure globally, same as firs allure */
  global.allure = allure2reporter.getInterface();
  return allure2reporter
}
const getAllure1reporter = () => new Allure1Reporter(reporterConfig)

jasmineRun.jasmine.DEFAULT_TIMEOUT_INTERVAL = 5_000
jasmineRun.loadConfig({
  spec_dir: 'spec',
  spec_files: allureVersion === 1 ? ['allure1/*.spec.*'] : ['allure2/*.spec.*'],
  helpers: ['../report_helpers/jasmine.afterAll.*'],
  random: false,
  seed: null,
  stopSpecOnExpectationFailure: false,
})

jasmineRun.addReporter(allureVersion === 1 ? getAllure1reporter() : getAllure2reporter())
jasmineRun.onComplete(() => {
  setPropertiesToReport(allureVersion)
  copyHistoryFromReport(allureVersion)
  generateReport(allureVersion)
})

jasmineRun.execute()
