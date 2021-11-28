import * as express from 'express';

import {PORT} from './src/data/constants'
import {pluginMiddleware, plugInRoutes} from './src/startup';
import {createFolders} from './src/helpers/onPrepare'

createFolders();

const app = express();

pluginMiddleware(app);

plugInRoutes(app);

app.listen(PORT, () => console.log(`Allure Server is listening on port ${PORT}!`));
