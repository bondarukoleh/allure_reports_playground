import * as allure from 'allure-commandline';
import * as fs from 'fs-extra';

function generateAllureReport(resultsDir: string, reportDir: string): Promise<void> {
  return allure(['generate', resultsDir, '-o', reportDir])
}

function copyPreviousHistory(previousReportHistoryDir: string | null, currentResultsHistoryDir: string) {
  if (previousReportHistoryDir === null) {
    console.log('No previous history found!');
  } else if (fs.existsSync(previousReportHistoryDir)) {
    console.log(`Copying history from ${previousReportHistoryDir} to ${currentResultsHistoryDir}`);
    fs.copySync(previousReportHistoryDir, currentResultsHistoryDir);
  }
}

export {generateAllureReport, copyPreviousHistory};
