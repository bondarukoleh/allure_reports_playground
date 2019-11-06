import * as fs from 'fs';
import * as path from 'path';

/* ATTENTION: To set trend properly we must run report each time test are ran
 because we need to copy generated history to allure result folder after each test run */

function copyHistoryFromReport(allureVersion: number | string = '') {
  const cwd = process.cwd()
  const allureReportPath = path.resolve(cwd, `allure${allureVersion}-report`)
  const allureReportHistory = path.resolve(cwd, `allure${allureVersion}-report/history`)
  const allureResultsHistory = path.resolve(cwd, `allure${allureVersion}-results/history`)

  try {
    if (fs.existsSync(allureReportPath)) {
      createResultHistory(allureResultsHistory);
      return fs.readdirSync(allureReportHistory).forEach((file) => {
        const reportHistoryFile = path.resolve(allureReportHistory, file);
        const resultHistoryFile = path.resolve(allureResultsHistory, file);
        fs.writeFileSync(resultHistoryFile, fs.readFileSync(reportHistoryFile))
      })
    }
    console.log(`Report isn't generated, so no history can be copied.`);
  } catch (e) {
    console.warn(`ATTENTION: COULD'N COPY HISTORY FROM REPORT RESULTS.
    Error: ${e.message}
    Report will be generated with broken history trend.`)
  }
}

function createResultHistory(allureResultsHistory: string) {
  if (!fs.existsSync(allureResultsHistory)) {
    console.log(`Creating results history directory "${allureResultsHistory}"`)
    return fs.mkdirSync(allureResultsHistory, {recursive: true})
  }
  console.log(`Results history directory "${allureResultsHistory}" is already created`);
}

export {copyHistoryFromReport}
