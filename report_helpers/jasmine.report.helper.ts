import * as fs from 'fs';
import * as path from 'path';

const allureResultsPath = path.resolve(__dirname, '../allure-results')
const allureEnvPropertiesPath = path.resolve(__dirname, '../allure-results/environment.properties')
const allureCategoriesPath = path.resolve(__dirname, '../allure-results/categories')
const allureEnvProperties = 'Automation_Browsers=Chrome\nTest_Report=Yes';
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

function setPropertiesToReport() {
  try {
    createResultsDirectory()
    fs.writeFileSync(allureEnvPropertiesPath, allureEnvProperties, {encoding: 'utf8'})
    fs.writeFileSync(allureCategoriesPath, JSON.stringify(allureCategories), {encoding: 'utf8'})
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
