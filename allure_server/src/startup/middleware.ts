import * as express from 'express';
import {REPORTS_DIR_REL_PATH} from '../data/constants'
import * as session from 'express-session';

import {SECRET_KEY} from '../data/constants'

export function pluginMiddleware(app) {
  app.use(express.static(REPORTS_DIR_REL_PATH)); // static serving from reports folder
  app.use(session({
    secret: SECRET_KEY,
    resave: false, /* to not save session if it has not modified */
    saveUninitialized: false, /* do not create cookie for uninitialized users */
    cookie: {maxAge: 600000}, /* cookie will be valid for an hour */
    name: 'allure-cookie'
  }));
  app.use(express.urlencoded({extended: true}));
};
