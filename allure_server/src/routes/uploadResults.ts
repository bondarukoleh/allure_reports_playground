import * as express from 'express';
import * as path from 'path';

import {routes} from '../data/routes';
import {fileUploader} from '../middleware'
import {
  extractPathFromRequest,
  extractUrlPathFromRequest,
  generateReport,
  getReportPaths,
  extractResults,
  findAndCopyPreviousHistory,
} from '../helpers';
import {HOST, PORT} from '../data/constants';

const router = express.Router();

/* This is field name that client will send the archive file with  */
const RESULTS_ARCHIVE_FIELD = 'allureArchive'

router.post('/', fileUploader.single(RESULTS_ARCHIVE_FIELD), async (req, res) => {
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

  let urlPathToReport = extractUrlPathFromRequest(req)

  res.send(`${HOST}:${PORT}/${urlPathToReport}${BUILD_NUMBER}`);
});

router.get('/', (req, res) => {
  return res.send('You should upload results here. There is nothing to GET')
})

export const uploadResultRoute = {url: routes.uploadResults, handler: router};
