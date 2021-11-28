import * as fsExtra from 'fs-extra'

import {
  CONTENT_DIR_FULL_PATH,
  BACKUP_DIR_FULL_PATH,
  REPORTS_DIR_FULL_PATH,
} from '../data/constants'

const foldersToCreate = [
  CONTENT_DIR_FULL_PATH,
  BACKUP_DIR_FULL_PATH,
  REPORTS_DIR_FULL_PATH,
]

foldersToCreate.forEach((dirPath) => fsExtra.ensureDirSync(dirPath))
