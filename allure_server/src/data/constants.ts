import {join, resolve} from 'path'
const {HOST = 'http://localhost', PORT = '4000'} = process.env;

const CONTENT_DIR_NAME = 'content';
const CONTENT_DIR_FULL_PATH = resolve('content');

const REPORTS_DIR_NAME = 'reports';
const REPORTS_DIR_REL_PATH = join(CONTENT_DIR_NAME, REPORTS_DIR_NAME);
const REPORTS_DIR_FULL_PATH = resolve(REPORTS_DIR_REL_PATH);

const BACKUP_DIR_NAME = 'backups';
const BACKUP_DIR_REL_PATH = join(CONTENT_DIR_NAME, BACKUP_DIR_NAME);
const BACKUP_DIR_FULL_PATH = resolve(BACKUP_DIR_REL_PATH);

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
}
