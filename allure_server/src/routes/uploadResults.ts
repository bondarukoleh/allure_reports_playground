import * as express from 'express';
import * as path from 'path';

import {routes} from '../data/routes';
import {fileUploader} from '../middleware'
import {
  extractPathFromRequest,
  generateReport,
  getReportPaths,
  extractResults,
  findAndCopyPreviousHistory,
} from '../helpers';
import {ALLURE_URL, REPORTS_DIR_NAME} from '../data/constants';
import {hasCookie} from '../middleware/auth';

const router = express.Router();

/* This is field name that client will send the archive file with  */
const RESULTS_ARCHIVE_FIELD = 'allureArchive'

router.post('/', [hasCookie, fileUploader.single(RESULTS_ARCHIVE_FIELD)], async (req, res) => {
  const BUILD_NUMBER = path.basename(req.file.originalname, '.zip'); /* 12345 */
  const extractedPath = extractPathFromRequest(req)
  const {reportsPlaceDirFullPath, reportDirFullPath} = getReportPaths(extractedPath, BUILD_NUMBER)

  const extractedResultsDirFullPath = await extractResults({
    resultsZipFullPath: req.file.path,
    buildNumber: BUILD_NUMBER,
    extractedPath
  })

  findAndCopyPreviousHistory({
    findHistoryFromDir: reportsPlaceDirFullPath,
    copyHistoryToDir: extractedResultsDirFullPath
  })

  await generateReport({
    resultsDirFullPath: extractedResultsDirFullPath,
    generateReportTo: reportDirFullPath
  })

  return res.send(`${ALLURE_URL}/${REPORTS_DIR_NAME}/${BUILD_NUMBER}`);
});

router.get('/', hasCookie, (req, res) => {
  return res.send('You should upload results here. There is nothing to GET')
})

export const uploadResultRoute = {url: routes.uploadResults, handler: router};
