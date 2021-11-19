import * as express from 'express';
import {routes} from '../data/routes';
import {findReportPathByBuild} from '../helpers';
import {HOST, PORT, REPORTS_DIR_FULL_PATH} from '../data/constants';
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('You need to provide build number')
})

router.get('/:id', (req, res) => {
  const neededPath = findReportPathByBuild(req.params.id, REPORTS_DIR_FULL_PATH);
  if (!neededPath) {
    return res.status(404).send(`BuildNumber "${req.params.id}" not found`)
  }
  return res.redirect(301, `${HOST}:${PORT}/${neededPath}`);
})

export const reportsRoute = {url: routes.reports, handler: router};
