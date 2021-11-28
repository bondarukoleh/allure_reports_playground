import * as express from 'express';
import * as session from 'express-session';

import {SECRET_KEY} from '../data/constants'

export function pluginMiddleware(app) {
  app.use(session({
    secret: SECRET_KEY,
    resave: false, /* to not save session if it has not modified */
    saveUninitialized: false, /* do not create cookie for uninitialized users */
    cookie: {maxAge: 1200000}, /* milliseconds cookie should be valid */
    name: 'allure-cookie'
  }));
  app.use(express.urlencoded({extended: true}));
};
