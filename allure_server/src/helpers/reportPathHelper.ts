import * as path from 'path';
import {Request} from 'express';

import {readDir} from './common'

/*
  Depend on test run environment and job type - we gather the path to report
  Should parse body {reportTypes: '["DEV","core"]'} to path DEV\core
*/
const extractPathFromRequest = (request: Request): string => {
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

const findReportPathByBuild = (buildNumber: string, findInDirFullPath: string): string | null => {
  const reportsPath = readDir(findInDirFullPath, []);
  const neededReportPath = reportsPath.find((reportPath) => path.basename(reportPath) === buildNumber);
  /* neededReportPath - e.g. full_path/content/reports/DEV/core/12345 */

  if (!neededReportPath) {
    return null
  }

  const pathElements = neededReportPath.split(/[/\\]/); /* ['content', 'reports', 'DEV', 'core', '12345'] */
  const indexOfRelativePath = pathElements.indexOf(path.basename(findInDirFullPath)) + 1; /* To find where we need splice arr */
  return pathElements.slice(indexOfRelativePath).join('/'); /* To get relative path to report e.g. DEV/core/12347 */
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
  extractPathFromRequest,
  extractUrlPathFromRequest
};
