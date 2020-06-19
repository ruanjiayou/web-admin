import models from '../models'
import { ws } from '../utils/ws'

export default {
  app: models.app.create({
    menuKey: window.localStorage.getItem('menu-key') || 'dashboard',
  }),
  user: models.user.create({
    isSignIn: localStorage.getItem('user-token') ? true : false,
    token: localStorage.getItem('user-token') || '',
    username: localStorage.getItem('user-username') || '',
  }),
  ws,
  messages: {},
  config: models.config.create(),
  channels: [],
  groups: [],
}