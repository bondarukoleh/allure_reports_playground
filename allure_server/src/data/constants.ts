import {join, resolve} from 'path'
import * as os from 'os'
const {HOST = 'localhost', PORT = '4000', SECRET_KEY, IN_DOCKER = true} = process.env;

const homeDirFullPath = os.homedir();
const ALLURE_DATA_DIR_NAME = 'allure_reports_data'

const CONTENT_DIR_NAME = 'content';
const CONTENT_DIR_FULL_PATH = IN_DOCKER
  ? join(homeDirFullPath, ALLURE_DATA_DIR_NAME, CONTENT_DIR_NAME)
  : resolve(CONTENT_DIR_NAME);

const REPORTS_DIR_NAME = 'reports';
const REPORTS_DIR_REL_PATH = join(CONTENT_DIR_NAME, REPORTS_DIR_NAME);
const REPORTS_DIR_FULL_PATH = IN_DOCKER
  ? join(homeDirFullPath, ALLURE_DATA_DIR_NAME, REPORTS_DIR_REL_PATH)
  : resolve(REPORTS_DIR_REL_PATH);

const BACKUP_DIR_NAME = 'backups';
const BACKUP_DIR_REL_PATH = join(CONTENT_DIR_NAME, BACKUP_DIR_NAME);
const BACKUP_DIR_FULL_PATH = IN_DOCKER
  ? join(homeDirFullPath, ALLURE_DATA_DIR_NAME, BACKUP_DIR_REL_PATH)
  : resolve(BACKUP_DIR_REL_PATH);

export {
  CONTENT_DIR_NAME,
  CONTENT_DIR_FULL_PATH,
  REPORTS_DIR_NAME,
  REPORTS_DIR_REL_PATH,
  REPORTS_DIR_FULL_PATH,
  BACKUP_DIR_NAME,
  BACKUP_DIR_REL_PATH,
  BACKUP_DIR_FULL_PATH,
  PORT,
  HOST,
  SECRET_KEY,
  IN_DOCKER
}
