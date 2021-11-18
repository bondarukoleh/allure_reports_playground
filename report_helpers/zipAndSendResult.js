const {zip} = require('zip-a-folder');
const fetch = require('node-fetch');
const fs = require("fs");
const fsExtra = require("fs-extra");
const FormData = require("form-data");
const path = require('path')

const {
  TEST_ENV = 'DEV',
  BUILD_ID = '12347',
  JOB_TYPE = 'core',
  ALLURE_SERVER_HOST = 'http://localhost:4400',
} = process.env;

const zippedResultsDirName =  path.resolve(process.cwd(),`zippedResults`);
const allureResultsDir =  path.resolve(process.cwd(),`allure-results`);
fsExtra.ensureDirSync(zippedResultsDirName);

const zippedResultsPath = `${zippedResultsDirName}/${BUILD_ID}.zip`
const sendMergedResults = async () => {
  console.info(`Zipping the allure report...`);
  await zip(allureResultsDir, zippedResultsPath);
  const formData = new FormData();
  /* formData.append('allureArchive' - this name vital to get data on server side */
  formData.append('allureArchive', fs.createReadStream(zippedResultsPath));
  formData.append('reportTypes', JSON.stringify( [TEST_ENV, JOB_TYPE] ));
  console.info(`Zipped the allure report`);
  try {
    return fetch(ALLURE_SERVER_HOST, {
      body: formData,
      method: 'POST',
    });
  } catch (e) {
    console.error(`Couldn't send the results to server!`);
    console.error(e);
  }
};

sendMergedResults()
  .then(res => {
    console.log('Results send');
    console.log(res.status);
    console.log(res.statusText);
    return res.text()
  })
  .then(responseText => console.log(`Report URL: ${responseText}`))
  .catch(err => {
    console.error(`Couldn't send the request with results!`);
    console.error(err);
  });
