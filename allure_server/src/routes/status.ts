import * as express from 'express';
import {routes} from '../data/routes';
import {hasCookie} from '../middleware/auth';

const router = express.Router();

router.get('/', hasCookie, (req, res) => {
  return res.send('Allure server alive.')
})

export const statusRoute = {url: routes.status, handler: router};
