import * as fs from 'fs';
import * as path from 'path';
import {Request} from 'express';

const isExcludedDir = (dirPath: string, excludedDirs: string[] = []): boolean => {
  return excludedDirs.some((excludeDir) => dirPath.includes(excludeDir));
};

const validateDir = (dirPath: string, excludedDirs?: string[]): boolean => {
  if (excludedDirs?.length) {
    return fs.statSync(dirPath).isDirectory() && !isExcludedDir(dirPath, excludedDirs);
  }
  return fs.statSync(dirPath).isDirectory()
};

/*
  Depend on test run environment and job type - we gather the path to report
  Should parse body {reportTypes: '["DEV","core"]'} to path DEV\core
*/
const extractPathFromRequest = (request: Request): string => {
  console.log(`Extracting path from ${request.body.reportTypes}`)
  let parsedPath = ''
  try {
    const testTypesArr = JSON.parse(request.body.reportTypes) as unknown as []
    parsedPath = testTypesArr.reduce((gatheredPath: string, pathElement: string) => {
      return path.join(gatheredPath, pathElement)
    }, parsedPath);
  } catch (e) {
    console.error(`Couldn't get the report path from passed parameters`)
    console.error(e)
  }
  return parsedPath /* Should return something like DEV\core */
}

function readDir(folderToRead: string, results: string[], excludedDirs: string[] = []): string[] {
  const isReportDir = (dirPath: string): boolean => fs.existsSync(path.join(dirPath, 'index.html'));

  const currentFiles = fs.readdirSync(folderToRead);
  currentFiles.forEach((file) => {
    const currentFilePath = path.join(folderToRead, file);
    if (validateDir(currentFilePath, excludedDirs) && !isReportDir(currentFilePath)) {
      readDir(currentFilePath, results, excludedDirs);
    } else {
      if (validateDir(currentFilePath, excludedDirs)) {
        results.push(currentFilePath);
      }
    }
  });
  return results;
}

function findReportPathByBuild(buildNumber: string, findInDir: string, excludeDirs: string[]): string {
  const reportsPath = readDir(path.resolve(findInDir), [], excludeDirs);
  const neededReportPath = reportsPath.find((reportPath) => path.basename(reportPath) === buildNumber);
  if (!neededReportPath) {
    throw new Error(`No such build number`);
  }

  const pathElements = neededReportPath.split(/[/\\]/);
  const indexOfRelativePath = pathElements.indexOf(path.basename(findInDir)) + 1; /* To find where we need splice arr */
  console.log('indexOfRelativePath')
  console.log(pathElements.slice(indexOfRelativePath).join('/'))
  return pathElements.slice(indexOfRelativePath).join('/'); /* To get relative path to report */
}

/*
  Should return previous report history dir to make a trend in new report
*/
function findPreviousReportHistoryDir(parentDirFullPath: string): string | null {
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
    latestReportDir = path.resolve(parentDirFullPath, dirs[0]);
  }
  return latestReportDir.length ? path.join(parentDirFullPath, path.join(latestReportDir, 'history')) : null;
}

/*
  Extracts url path from {reportTypes: '["DEV","core"]'} to path DEV/core
*/
const extractUrlPathFromRequest = (request: Request): string => {
  console.log(`Extracting url from ${request.body.reportTypes}`)
  let urlPathToReport = ''
  try {
    const testTypesArr = JSON.parse(request?.body?.reportTypes) as unknown as []
    urlPathToReport = testTypesArr.reduce((gathered: string, pathElem: string) => {
      return gathered += `${pathElem}/`
    }, '');
  } catch (e) {
    console.error(`Couldn't get the URL path from passed parameters`)
    console.error(e)
  }
  return urlPathToReport
}

export {
  findReportPathByBuild,
  findPreviousReportHistoryDir,
  extractPathFromRequest,
  extractUrlPathFromRequest
};
