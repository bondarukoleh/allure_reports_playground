import * as fs from 'fs'
import * as path from 'path'

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

function setPropertiesToReport(allureVersion: number | string = '') {
  const allureResultsPath = path.resolve(process.cwd(), `allure${allureVersion}-results`)
  const allureEnvPropertiesPath = path.join(allureResultsPath, `/environment.properties`)
  const allureCategoriesPath = path.join(allureResultsPath, `/categories.json`)
  const allureExecutorPath = path.join(allureResultsPath, `/executor.json`)
  try {
    createResultsDirectory(allureResultsPath)
    console.log(allureEnvPropertiesPath);
    fs.writeFileSync(allureEnvPropertiesPath, allureEnvProperties, {encoding: 'utf8'})
    fs.writeFileSync(allureCategoriesPath, JSON.stringify(allureCategories), {encoding: 'utf8'})
    fs.writeFileSync(allureExecutorPath, JSON.stringify(executor), {encoding: 'utf8'})
  } catch (e) {
    console.warn(`Couldn't write env properties for report. Error is: ${e.message}`)
    console.warn(`Full error`, e)
  }
}

function createResultsDirectory(allureResultsPath: string) {
  if (!fs.existsSync(allureResultsPath)) {
    console.log(`Creating results directory "${allureResultsPath}"`)
    fs.mkdirSync(allureResultsPath)
  } else {
    console.log(`Setting properties: Results directory "${allureResultsPath}" is already present.`)
  }
}

export {setPropertiesToReport}
