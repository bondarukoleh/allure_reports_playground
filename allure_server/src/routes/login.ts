import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

const router = express.Router();
import {user} from '../data/users';
import {routes} from '../data/routes';
import {REPORTS_DIR_NAME} from '../data/constants';

router.post('/', async (req, res) => {
  const validUserName = await bcrypt.compare(req.body.username, user.name);
  const validPassword = await bcrypt.compare(req.body.password, user.pass);
  if (!validUserName && !validPassword) {
    if (req.body.fromApi) {
      return res.status(400).json({error: `Invalid Email or Password.`});
    }
    return res.redirect(301, routes.login)
  }

  /* req.session is from express-session middleware, this is how user gets session */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.session.loggedIn = true;

  if (req.body.fromApi) {
    /* Api user should parse the set-cookie header from express-session middleware */
    return res.end()
  }

  return res.redirect(`/${REPORTS_DIR_NAME}`);
});

router.get('/', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (req.session.loggedIn) {
    return res.redirect(`/${REPORTS_DIR_NAME}`);
  }
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

export const loginRoute = {url: routes.login, handler: router};
