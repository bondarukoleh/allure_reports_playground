import * as allure from 'allure-commandline';
import * as fs from 'fs-extra';
import * as path from 'path';

function generateAllureReport(resultsDir: string, reportDir: string): Promise<void> {
  return allure(['generate', resultsDir, '-o', reportDir])
}

function copyDir(src: string | null, dest: string, errMsg?: string) {
  if (src === null) {
    errMsg && console.error(errMsg);
  } else if (fs.existsSync(src)) {
    console.log(`Copying dir from ${src} to ${dest}...`);
    fs.copySync(src, dest);
  }
}

const validateDir = (dirPath: string): boolean => {
  return fs.statSync(dirPath).isDirectory()
};

function readDir(folderToRead: string, results: string[]): string[] {
  const isReportDir = (dirPath: string): boolean => fs.existsSync(path.join(dirPath, 'index.html'));

  const currentFiles = fs.readdirSync(folderToRead);
  currentFiles.forEach((file) => {
    const currentFilePath = path.join(folderToRead, file);
    if (validateDir(currentFilePath) && !isReportDir(currentFilePath)) {
      readDir(currentFilePath, results);
    } else {
      if (validateDir(currentFilePath)) {
        results.push(currentFilePath);
      }
    }
  });
  return results;
}

export {generateAllureReport, copyDir, readDir, validateDir};
