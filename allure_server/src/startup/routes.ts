import {uploadResultRoute, statusRoute} from '../routes'

export function plugInRoutes(app) {
  app.use(uploadResultRoute.url, uploadResultRoute.handler);
  app.use(statusRoute.url, statusRoute.handler);
};
