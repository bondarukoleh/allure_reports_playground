import * as fs from 'fs';
import * as path from 'path';

/* ATTENTION: To set trend properly we must run report each time test are ran
 because we need to copy generated history to allure result folder after each test run */

const allureReportPath = path.resolve(__dirname, '../../allure-report')
const allureReportHistory = path.resolve(__dirname, '../../allure-report/history')
const allureResultsHistory = path.resolve(__dirname, '../../allure-results/history')

function copyHistoryFromReport() {
  try {
    if (fs.existsSync(allureReportPath)) {
      createResultHistory();
      fs.readdirSync(allureReportHistory).forEach((file) => {
        const reportHistoryFile = path.resolve(allureReportHistory, file);
        const resultHistoryFile = path.resolve(allureResultsHistory, file);
        fs.writeFileSync(resultHistoryFile, fs.readFileSync(reportHistoryFile))
      })
    }
  } catch (e) {
    console.warn(`ATTENTION: COULD'N COPY HISTORY FROM REPORT RESULTS.
    Error: ${e.message}
    Report will be generated with broken history trend.`)
  }
}

function createResultHistory() {
  if (!fs.existsSync(allureResultsHistory)) {
    console.log(`Creating results history directory.`)
    fs.mkdirSync(allureResultsHistory, {recursive: true})
  }
}

copyHistoryFromReport()
