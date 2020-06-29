import models from '../models'
import { ws } from '../utils/ws'

const store = {
  app: models.app.create({
    menuKey: window.localStorage.getItem('menu-key') || '/admin/home/dashboard',
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8097' : '',
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

export default store