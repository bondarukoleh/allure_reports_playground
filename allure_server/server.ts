import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as extractZip from 'extract-zip';
import {
  findReportPathByBuild,
  generateAllureReport,
  makeReportPathFromRequest,
  findPreviousReportHistoryDir,
  copyPreviousHistory
} from './report_helpers';

const port = 4400;
const backupDirName = 'results_backup';
const contentDirName = 'content';
let backupZippedResultsDir = ''; /* e.g. ./content/regression/mock/results_backup */
const {HOST = 'http://localhost'} = process.env;

/*{
destination and file
  fieldname: 'archive',
  originalname: 'DEV-core-1__2021-11-17T172220772Z.zip',
  encoding: '7bit',
  mimetype: 'application/zip'
}
*/

const storage = multer.diskStorage({
  destination(req, file, callback) {
    backupZippedResultsDir = path.join(contentDirName, backupDirName);
    fs.ensureDirSync(backupZippedResultsDir);
    callback(null, backupZippedResultsDir);
  },
  filename(req, file, callback) {
    const d = new Date();
    const currentDate = `${d.getDate()}_${d.getMonth() + 1}-${d.getHours()}_${d.getMinutes()}_${d.getSeconds()}`;
    callback(null, `${file.originalname}-${currentDate}`);
  }
});

const uploader = multer({storage});
const uploadHandler = uploader.single('allureArchive')

const app = express();

app.use(express.static(path.join(__dirname, contentDirName)))
app.post('/', uploadHandler, async (req, res) => {
  /*
  * {
  fieldname: 'archive',
  originalname: 'DEV-core-1__20211117T172220772Z.zip',
  encoding: '7bit',
  mimetype: 'application/zip',
  destination: 'C:\\disk\\projects\\allure_reports_playground\\allure_server\\someFolder',
  filename: 'DEV-core-1__2021-11-17T172220772Z.zip-17_11-18_22_20',
  path: 'C:\\disk\\projects\\allure_reports_playground\\allure_server\\someFolder\\DEV-core-1__20211117T172220772Z.zip-17_11-18_22_20',
  size: 3584
}

  * */
  const buildNumber = path.basename(req.file.originalname, '.zip'); /* 12345 */
  const reportBasicPath = makeReportPathFromRequest(req, contentDirName); /* e.g. content/DEV/core */
  const fullReportBasicPath = path.join(__dirname, reportBasicPath)
  fs.ensureDirSync(fullReportBasicPath);

  const reportDir = path.join(reportBasicPath, buildNumber); /* e.g. content/DEV/core/12345 */
  const resultsBackupDir = path.resolve(backupZippedResultsDir, buildNumber); // e.g. /**/content/regression/mock/results_backup/100
  const previousReportHistoryDir = findPreviousReportHistoryDir(reportBasicPath, [backupDirName]); /* e.g. ./content/regression/mock/99/history */

  /* If there was a mistake - clear previous results backup dir */
  fs.emptyDirSync(resultsBackupDir);

  try {
    /* req.file.path -> e.g. ./content/regression/mock/results_backup/123.zip-15_11-10_30_15 */
    await extractZip(req.file.path, {dir: resultsBackupDir});
  } catch (error) {
    console.error(`Could not extract archive '${req.file.path}' to '${resultsBackupDir}'`);
    console.error(error);
    return;
  }

  /* Adding previous history to new results */
  copyPreviousHistory(previousReportHistoryDir, path.join(resultsBackupDir, 'history'));

  /* clean report with same ID */
  fs.emptyDirSync(reportDir);

  try {
    await generateAllureReport(resultsBackupDir, reportDir);
  } catch (error) {
    console.error(`Could not generate allure report in '${reportDir}'`);
    console.error(error)
    return;
  }

  let urlPathToReport;
  try {
    const testTypesArr = JSON.parse(req?.body?.reportTypes) as unknown as []
    urlPathToReport = testTypesArr.reduce((gathered: string, pathElem: string) => {
      return gathered += `${pathElem}/`
    }, '');
  } catch (e) {}

  res.send(`${HOST}:${port}/${urlPathToReport}${buildNumber}`);
});

// app.get(/\/\d+/, (req, res) => {
//   console.log('Got get req')
//   const buildNumber = req.url.match(/\d+/g);
//   const neededPath = findReportPathByBuild(buildNumber[0], contentDirName, [backupDirName]);
//   return res.redirect(301, `${HOST}/${neededPath}/`);
//   express.static(path.join(__dirname, 'public'))
// });

app.listen(port, () => console.log(`App listening on port ${port}!`));
