import * as express from 'express';
import {REPORTS_DIR_REL_PATH} from '../data/constants'

export function pluginMiddleware(app) {
  app.use(express.static(REPORTS_DIR_REL_PATH)); // static serving from reports folder
};
