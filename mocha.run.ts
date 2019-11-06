import * as Mocha from 'mocha'
import * as path from 'path'
import * as fs from 'fs'
import * as argParser from 'minimist'
import {setPropertiesToReport, copyHistoryFromReport, generateReport} from './report_helpers'

const {allureV} = argParser(process.argv)

const mocha = new Mocha({
  timeout: 5000,
  reporter: 'mocha-allure2-reporter',
  reporterOptions: {
    /* Unfortunately this is useless here */
    targetDir: `./allure${allureV}-results`
  }
})

const testDir = path.resolve(process.cwd(), 'spec', 'allure2')
const files = fs.readdirSync(testDir)
const tests = files.filter((file) => file.includes('.spec.'))

tests.forEach((spec) => mocha.addFile(path.join(testDir, spec)))

mocha.run((failures) => {
  setPropertiesToReport()
  copyHistoryFromReport()
  generateReport()
  process.exitCode = failures ? 1 : 0
})
