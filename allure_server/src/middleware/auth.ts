import {ALLURE_URL} from '../data/constants'
import {routes} from '../data/routes'

export function hasCookie(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    const loginLink = `${ALLURE_URL}${routes.login}`
    return res.status(400).send(`Invalid session. Please <a href=${loginLink}>login</a>`);
  }
}
