import {uploadResultRoute, statusRoute, reportsRoute, loginRoute} from '../routes'

export function plugInRoutes(app) {
  app.use(uploadResultRoute.url, uploadResultRoute.handler);
  app.use(statusRoute.url, statusRoute.handler);
  app.use(reportsRoute.url, reportsRoute.handler);
  app.use(loginRoute.url, loginRoute.handler);
  app.get('*', (req, res) => {
    res.redirect(loginRoute.url)
  });
};
