import * as fs from 'fs'
import * as path from 'path'

const allureResultsPath = path.resolve(__dirname, '../../allure1-results')
const allureEnvPropertiesPath = path.resolve(__dirname, '../../allure1-results/environment.properties')
const allureCategoriesPath = path.resolve(__dirname, '../../allure1-results/categories.json')
const allureExecutorPath = path.resolve(__dirname, '../../allure1-results/executor.json')

const allureEnvProperties = 'Variable_FFOM_FILE=Yes\nTest_Report=Yes';
const allureCategories = [
  {
    name: 'Skipped because of environment',
    matchedStatuses: [
      'skipped'
    ]
  },
  {
    name: `Couldn't wait for condition`,
    traceRegex: '.*Wait.*',
    matchedStatuses: [
      'broken',
      'failed'
    ]
  }
];
const executor = {
  name: 'Jenkins',
  type: 'jenkins',
  url: 'http://example.org',
  buildOrder: 8,
  buildName: 'Test automation #1',
  buildUrl: 'http://example.org/build#13',
  reportUrl: 'http://example.org/build#13/AllureReport',
  reportName: 'Demo allure report'
}

function setPropertiesToReport() {
  try {
    createResultsDirectory()
    fs.writeFileSync(allureEnvPropertiesPath, allureEnvProperties, {encoding: 'utf8'})
    fs.writeFileSync(allureCategoriesPath, JSON.stringify(allureCategories), {encoding: 'utf8'})
    fs.writeFileSync(allureExecutorPath, JSON.stringify(executor), {encoding: 'utf8'})
  } catch (e) {
    console.warn(`Couldn't write env properties for report. Error is: ${e.message}`)
    console.warn(`Full error`, e)
  }
}

function createResultsDirectory() {
  if (!fs.existsSync(allureResultsPath)) {
    console.log(`Creating results directory.`)
    fs.mkdirSync(allureResultsPath)
  }
}

export {setPropertiesToReport}
