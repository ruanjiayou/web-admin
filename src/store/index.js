import models from '../models'
import storage from '../utils/storage'
import { ws } from '../utils/ws'

const store = {
  app: models.app.create(),
  user: models.user.create(),
  ws,
  messages: {},
  config: models.config.create(),
  channels: [],
  groups: [],
}

storage.prefix = store.app.storagePrefix
store.app.set('menuKey', storage.getValue('menu-key') || '/admin/home/dashboard')
store.app.set('baseUrl', process.env.NODE_ENV === 'development' ? 'http://localhost:8097' : '')
store.app.set('imageLine', process.env.NODE_ENV === 'development' ? 'http://localhost:8097' : '')
store.user.setToken(storage.getValue('user-token') || '')
store.user.setUsername(storage.getValue('user-username') || '')

export default store