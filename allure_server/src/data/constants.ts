import {join, resolve} from 'path'
const {HOST = 'localhost', PORT = '4000', SECRET_KEY} = process.env;

const CONTENT_DIR_NAME = 'content';
const CONTENT_DIR_FULL_PATH = resolve(CONTENT_DIR_NAME);

const REPORTS_DIR_NAME = 'reports';
const REPORTS_DIR_FULL_PATH = join(CONTENT_DIR_FULL_PATH, REPORTS_DIR_NAME)

const BACKUP_DIR_NAME = 'backups';
const BACKUP_DIR_FULL_PATH = join(CONTENT_DIR_FULL_PATH, BACKUP_DIR_NAME)

const ALLURE_URL = `http://${HOST}:${PORT}`

export {
  CONTENT_DIR_NAME,
  CONTENT_DIR_FULL_PATH,
  REPORTS_DIR_NAME,
  REPORTS_DIR_FULL_PATH,
  BACKUP_DIR_NAME,
  BACKUP_DIR_FULL_PATH,
  PORT,
  HOST,
  SECRET_KEY,
  ALLURE_URL
}
