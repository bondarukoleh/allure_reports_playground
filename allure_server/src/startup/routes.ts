import {uploadResultRoute, statusRoute, reportsRoute} from '../routes'

export function plugInRoutes(app) {
  app.use(uploadResultRoute.url, uploadResultRoute.handler);
  app.use(statusRoute.url, statusRoute.handler);
  app.use(reportsRoute.url, reportsRoute.handler);
};
