import * as express from 'express';
import {routes} from '../data/routes';
const router = express.Router();

router.get('/', (req, res) => {
  return res.send('Allure server alive.')
})

export const statusRoute = {url: routes.status, handler: router};
