import models from '../models'
import storage from '../utils/storage'
import { ws } from '../utils/ws'

const store = {
  app: models.app.create(),
  user: models.user.create(),
  ws,
  config: models.config.create(),
  channels: [],
  groups: [],
  types: [
    { name: '', title: '无'},
    { name: 'file', title: '文件'},
    { name: 'image', title: '图片'},
    { name: 'music', title: '音频'},
    { name: 'video', title: '视频'},
    { name: 'novel', title: '小说'},
    { name: 'article', title: '文章'},
    { name: 'news', title: '资讯'},
    { name: 'private', title: '私人'},
  ],
  city: [
    { name: '', title: '无'},
    { name: 'China', title: '中国'},
    { name: 'English', title: '英国'},
    { name: 'Japan', title: '日本'},
    { name: 'Korea', title: '韩国'},
    { name: 'Amarican', title: '美国'},
    { name: 'gat', title: '港澳台'},
  ]
}

storage.prefix = store.app.storagePrefix
store.app.set('menuKey', storage.getValue('menu-key') || '/admin/home/dashboard')
store.app.set('baseUrl', process.env.NODE_ENV === 'development' ? 'http://localhost:8097' : '')
store.app.set('imageLine', process.env.NODE_ENV === 'development' ? 'http://localhost:8097' : '')
store.user.setToken(storage.getValue('user-token') || '')
store.user.setUsername(storage.getValue('user-username') || '')

export default store