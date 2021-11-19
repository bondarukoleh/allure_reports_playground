import * as express from 'express';
import {routes} from '../data/routes';
import {fileUploader} from '../middleware'
import * as path from 'path';
import {
  copyPreviousHistory, extractPathFromRequest, extractUrlPathFromRequest,
  findPreviousReportHistoryDir,
  generateAllureReport,
} from '../helpers';
import {
  REPORTS_DIR_FULL_PATH,
  BACKUP_DIR_FULL_PATH,
  HOST,
  PORT
} from '../data/constants';
import * as fs from 'fs-extra';
import * as extractZip from 'extract-zip';
const router = express.Router();

/* This is field name that client will send the archive file with  */
const RESULTS_ARCHIVE_FIELD = 'allureArchive'

router.post('/', fileUploader.single(RESULTS_ARCHIVE_FIELD), async (req, res) => {
    const BUILD_NUMBER = path.basename(req.file.originalname, '.zip'); /* 12345 */
    const extractedPath = extractPathFromRequest(req)
    const reportPlaceFullPath = path.join(REPORTS_DIR_FULL_PATH, extractedPath) /* e.g. full_path/content/reports/DEV/core */
    fs.ensureDirSync(reportPlaceFullPath);

    const reportDirFullPath = path.join(reportPlaceFullPath, BUILD_NUMBER); /* e.g. full_path/content/reports/DEV/core/12345 */
    const resultsBackupDir = path.join(BACKUP_DIR_FULL_PATH, extractedPath, BUILD_NUMBER); // e.g. full_path/content/backups/regression/mock/results_backup/12345
    const previousReportHistoryDir = findPreviousReportHistoryDir(reportPlaceFullPath); /* e.g. full_path/content/regression/mock/12344/history */

    /* If there was a mistake - clear previous results backup dir */
    fs.emptyDirSync(resultsBackupDir);

    try {
      /* req.file.path comes from multer -> e.g. full_path/content/backups/DEV/core/15_11-10_30_15-123.zip */
      await extractZip(req.file.path, {dir: resultsBackupDir});
    } catch (error) {
      console.error(`Could not extract archive '${req.file.path}' to '${resultsBackupDir}'`);
      console.error(error);
      return;
    }

    /* Adding previous history to new results */
    copyPreviousHistory(previousReportHistoryDir, path.join(resultsBackupDir, 'history'));

    /* clean report with same ID */
    fs.emptyDirSync(reportDirFullPath);

    try {
      await generateAllureReport(resultsBackupDir, reportDirFullPath);
    } catch (error) {
      console.error(`Could not generate allure report to '${reportDirFullPath}'`);
      console.error(error)
      return;
    }

    let urlPathToReport = extractUrlPathFromRequest(req)

    res.send(`${HOST}:${PORT}/${urlPathToReport}${BUILD_NUMBER}`);
});

router.get('/', (req, res) => {
  return res.send('You should upload results here. There is nothing to GET')
})

export const uploadResultRoute = {url: routes.uploadResults, handler: router};
