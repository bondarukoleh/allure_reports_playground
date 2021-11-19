import * as path from 'path';
import {BACKUP_DIR_FULL_PATH, REPORTS_DIR_FULL_PATH} from '../../data/constants';
import * as fs from 'fs-extra';
import * as extractZip from 'extract-zip';
import {copyDir, generateAllureReport, validateDir} from '../common';

/*
  return path with test types where report should be generated
  and full path to the report folder including build number
*/
const getReportPaths = (extractedPath: string, buildNumber: string) => {
  const reportsPlaceDirFullPath = path.join(REPORTS_DIR_FULL_PATH, extractedPath)
  fs.ensureDirSync(reportsPlaceDirFullPath);
  const reportDirFullPath = path.join(reportsPlaceDirFullPath, buildNumber);
  return {
    reportsPlaceDirFullPath, /* e.g. full_path/content/reports/DEV/core */
    reportDirFullPath, /* e.g. full_path/content/reports/DEV/core/12345 */
  }
}

interface IExtractResults {
  extractedPath: string,
  buildNumber: string,
  resultsZipFullPath: string
}
/* return path with extracted results */
const extractResults = async ({extractedPath, resultsZipFullPath, buildNumber}: IExtractResults): Promise<string | null> => {
  const resultsDirFullPass = path.join(BACKUP_DIR_FULL_PATH, extractedPath, buildNumber); // e.g.                           full_path/content/backups/regression/mock/results_backup/12345

  /* If there was a mistake - clear previous results backup dir */
  fs.emptyDirSync(resultsDirFullPass);

  try {
    /* resultsZipFullPath comes from multer -> e.g. full_path/content/backups/15_11-10_30_15-123.zip */
    await extractZip(resultsZipFullPath, {dir: resultsDirFullPass});
  } catch (error) {
    console.error(`Could not extract archive '${resultsZipFullPath}' to '${resultsDirFullPass}'`);
    console.error(error);
    return null;
  }
  return resultsDirFullPass;
}

/*
  Should return previous report dir
*/
function findPreviousReportDir(parentDirFullPath: string): string | null {
  const dirs = fs.readdirSync(parentDirFullPath)
    .filter((dir: string) => validateDir(path.join(parentDirFullPath, dir)));
  let latestReportDir = '';

  if (dirs.length > 1) {
    latestReportDir = dirs.sort((dir1: string, dir2: string) => {
      const path1 = path.join(parentDirFullPath, dir1);
      const path2 = path.join(parentDirFullPath, dir2);
      return Number(fs.statSync(path1).birthtime > fs.statSync(path2).birthtime); /* sort by created time */
    }).pop() as string;
  } else if (dirs.length === 1) {
    latestReportDir = dirs[0];
  }
  return latestReportDir.length ? path.join(parentDirFullPath, latestReportDir) : null;
}

interface ICopyPreviousHistory {
  findHistoryFromDir: string,
  copyHistoryToDir: string
}
/* To get a trend anh history we need to copy history from previous report and copy it to results dir */
const findAndCopyPreviousHistory = ({findHistoryFromDir, copyHistoryToDir}: ICopyPreviousHistory) => {
  const previousReportDir = findPreviousReportDir(findHistoryFromDir); /* e.g. full_path/content/DEV/core/12344 */
  /* Adding previous report history to new results */
  copyDir(path.join(previousReportDir, 'history'), path.join(copyHistoryToDir, 'history'));
}

interface IGenerateReport {
  resultsDirFullPath: string,
  generateReportTo: string
}
const generateReport = async ({generateReportTo, resultsDirFullPath}: IGenerateReport) => {
  /* clean report with same ID if it is there */
  fs.emptyDirSync(generateReportTo);

  try {
    await generateAllureReport(resultsDirFullPath, generateReportTo);
  } catch (error) {
    console.error(`Could not generate allure report from "${resultsDirFullPath}" to "${generateReportTo}"`);
    console.error(error)
    return;
  }
}

export {getReportPaths, extractResults, findAndCopyPreviousHistory, generateReport}
