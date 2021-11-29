const {zip} = require('zip-a-folder');
const fetch = require('node-fetch');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

const {
  TEST_ENV = 'QA',
  ALLURE_SERVER_URL = 'http://localhost:4000',
  ALLURE_USER_NAME = 'qaadmin',
  ALLURE_USER_PASS = '1!Pass',
  BUILD_ID = '2',
  BUILD_DEFINITIONNAME = 'Automation.Core'
} = process.env;

if (!ALLURE_SERVER_URL && !BUILD_ID || !BUILD_DEFINITIONNAME) {
  console.log(`No Allure env vars or CI env vars provided. Report won't be sent!`);
  return;
}

const zippedResultsDirFullPath = path.resolve(process.cwd(), `zippedResults`);
const allureResultsDir = path.resolve(process.cwd(), `allure-results`);
const zippedResultsFileFullPath = `${zippedResultsDirFullPath}/${BUILD_ID}.zip`;
const loginURL = `${ALLURE_SERVER_URL}/login`;
const uploadURL = `${ALLURE_SERVER_URL}/upload-results`;

class Zipper {
  ensureDirExist(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  async zipDir(src, dest) {
    console.info(`Zipping the ${src}...`);
    return zip(src, dest);
  }
}

class Sender {
  _cookie = null;
  zipper = new Zipper()

  _getLoginBody() {
    const details = {
      username: ALLURE_USER_NAME,
      password: ALLURE_USER_PASS,
      fromApi: true
    };

    const formBody = [];
    for (const [key, value] of Object.entries(details)) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
  }

  _getAllureCookieFromHeaders(headers) {
    const allCookie = headers.get('set-cookie');
    const allureCookieStr = allCookie.split(';')[0];
    if (!allureCookieStr.length || !allureCookieStr.includes('allure-cookie')) {
      throw new Error(`There is no required cookies "${allCookie}"`);
    }
    return allureCookieStr;
  }

  _getSendResultsBody() {
    const formData = new FormData();
    /* 'allureArchive', 'reportTypes' - field names are vital! Used to extract data on server side */
    formData.append('allureArchive', fs.createReadStream(zippedResultsFileFullPath));
    formData.append('reportTypes', JSON.stringify([TEST_ENV, BUILD_DEFINITIONNAME]));
    return formData;
  }

  async login() {
    try {
      const response = await fetch(loginURL, {
        body: this._getLoginBody(),
        method: 'POST',
        headers: {['Content-Type']: 'application/x-www-form-urlencoded'}
      });
      const cookie = this._getAllureCookieFromHeaders(response.headers);
      if (!cookie) {
        throw new Error(`No cookie in response "${response.status} ${response.statusText}"`);
      }
      this._cookie = cookie;
    } catch (e) {
      console.error(`Couldn't login to allure server!`);
      console.error(e);
    }
  }

  async sendResults() {
    console.info(`Zipping the allure results...`);
    this.zipper.ensureDirExist(zippedResultsDirFullPath);
    await this.zipper.zipDir(allureResultsDir, zippedResultsFileFullPath);
    console.info(`Allure results zipped`);

    console.info(`Sending the allure report for build "${BUILD_ID}" to ${uploadURL},
    with path "${TEST_ENV}" and "${BUILD_DEFINITIONNAME}"`);

    try {
      const response = await fetch(uploadURL, {
        body: this._getSendResultsBody(),
        method: 'POST',
        headers: {['Cookie']: this._cookie}
      });
      const reportUrl = await response.text()
      console.log(`Report URL is: "${reportUrl}"`)
    } catch (e) {
      console.error(`Couldn't send the results to allure server!`);
      console.error(e);
    }
  }
}

const sendResults = async () => {
  const sender = new Sender()
  await sender.login();
  await sender.sendResults()
}

sendResults()
  .catch(err => {
    console.error('Allure send result request error!');
    console.error(err);
  });
