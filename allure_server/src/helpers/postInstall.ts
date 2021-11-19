import * as fsExtra from 'fs-extra'
import {
  BACKUP_DIR_FULL_PATH,
  CONTENT_DIR_FULL_PATH,
  REPORTS_DIR_FULL_PATH,
} from '../data/constants'

const foldersToCreate = [
  BACKUP_DIR_FULL_PATH,
  CONTENT_DIR_FULL_PATH,
  REPORTS_DIR_FULL_PATH,
]

foldersToCreate.forEach((dirPath) => fsExtra.ensureDirSync(dirPath))
