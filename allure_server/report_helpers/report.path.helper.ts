import * as fs from 'fs';
import * as path from 'path';
import {Request} from 'express';

const isExcludedDir = (dirPath: string, excludedDirs: string[] = []): boolean => {
  return excludedDirs.some((excludeDir) => dirPath.includes(excludeDir));
};

const validDir = (dirPath: string, excludedDirs: string[] = []): boolean => {
  return fs.statSync(dirPath).isDirectory() && !isExcludedDir(dirPath, excludedDirs);
};

function readDir(folderToRead: string, results: string[], excludedDirs: string[] = []): string[] {
  const isReportDir = (dirPath: string): boolean => fs.existsSync(path.join(dirPath, 'index.html'));

  const currentFiles = fs.readdirSync(folderToRead);
  currentFiles.forEach((file) => {
    const currentFilePath = path.join(folderToRead, file);
    if (validDir(currentFilePath, excludedDirs) && !isReportDir(currentFilePath)) {
      readDir(currentFilePath, results, excludedDirs);
    } else {
      if (validDir(currentFilePath, excludedDirs)) {
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

/* Depend on run tests environment and job type - we gather the path to report */
function makeReportPathFromRequest(request: Request, baseDir: string): string {
  /* User passes the i.e. {reportTypes: '["DEV","core"]'} */
  let parsedDir;
  try {
    const testTypesArr = JSON.parse(request.body.reportTypes) as unknown as []
    parsedDir = testTypesArr.reduce((gatheredPath: string, pathElement: string) => {
      return path.join(gatheredPath, pathElement)
    }, baseDir);
  } catch (e) {
    console.error(`Couldn't get the path to result`)
    console.error(e)
    return baseDir
  }
  return parsedDir; /* Should return something like baseDir/DEV/core */
}

function findPreviousReportHistoryDir(parentDir: string, exclude: string[] = []): string | null {
  const currentDirs = fs.readdirSync(parentDir)?.filter((dir: string) => validDir(path.join(parentDir, dir), exclude));
  let latestReportDir = '';
  if (currentDirs.length > 1) {
    latestReportDir = currentDirs.sort((dir1: string, dir2: string) => {
      const path1 = path.join(parentDir, dir1);
      const path2 = path.join(parentDir, dir2);
      return Number(fs.statSync(path1).birthtime > fs.statSync(path2).birthtime); /* sort by created time */
    }).pop() as string;
  } else if (currentDirs.length === 1) {
    latestReportDir = path.resolve(parentDir, currentDirs[0]);
  }
  return latestReportDir.length ? path.resolve(parentDir, path.join(latestReportDir, 'history')) : null;
}

export {findReportPathByBuild, makeReportPathFromRequest, findPreviousReportHistoryDir};
