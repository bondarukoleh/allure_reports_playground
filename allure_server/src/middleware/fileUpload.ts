import * as multer from 'multer';

import {BACKUP_DIR_FULL_PATH} from '../data/constants';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, BACKUP_DIR_FULL_PATH);
  },
  filename(req, file, callback) {
    const date = new Date();
    const currentDate = `${date.getDate()}_${date.getMonth() + 1}-${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    /* file.originalname should be build number, e.g. '12345.zip' */
    callback(null, `${currentDate}-${file.originalname}`);
  }
});

export const fileUploader = multer({storage})
