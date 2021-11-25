import * as express from 'express';
import {routes} from '../data/routes';
import {findReportPathByBuild} from '../helpers';
import {REPORTS_DIR_FULL_PATH, REPORTS_DIR_REL_PATH, REPORTS_DIR_NAME} from '../data/constants';
import {hasCookie} from '../middleware/auth';
const router = express.Router();

router.get('/', hasCookie, (req, res) => {
  return res.json('You need to provide build number, something like /reports/12345')
})

router.get('/:id', hasCookie, (req, res) => {
  const neededPath = findReportPathByBuild(req.params.id, REPORTS_DIR_FULL_PATH);
  if (!neededPath) {
    return res.status(404).send(`BuildNumber "${req.params.id}" not found`)
  }
  return res.redirect(301, `/${REPORTS_DIR_NAME}/${neededPath}`);
})

router.get('/*', [hasCookie, express.static(REPORTS_DIR_REL_PATH)])

export const reportsRoute = {url: routes.reports, handler: router};
