import models from '../models'
import storage from '../utils/storage'
import { ws } from '../utils/ws'

const store = {
  app: models.app.create(),
  apps: [],
  user: models.user.create(),
  logger: models.logger.create({ status: 'close', progress: {}, logs: [], keys: [], }),
  ws,
  config: models.config.create(),
  channels: [],
  groups: [],
  pages: [],
  menus: [],
  resource_types: [
    { name: '', title: '无' },
    { name: 'file', title: '文件' },
    { name: 'image', title: '图片' },

    { name: 'audio', title: '音频' },
    { name: 'music', title: '音乐' },

    { name: 'comic', title: '漫画' },
    { name: 'video', title: '视频' },
    { name: 'shortVideo', title: '短视频' },
    { name: 'movie', title: '电影' },
    { name: 'program', title: '节目' },
    { name: 'series', title: '电视剧' },
    { name: 'animate', title: '动漫' },

    { name: 'novel', title: '小说' },
    { name: 'article', title: '文章' },
    { name: 'news', title: '资讯' },
    { name: 'private', title: '私人' },
  ],
  medias: [
    // audip:mp3, video:mp4, image:jpg,png, txt: html,js, binary: zip,torrent, doc,pdf
  ],
  regions: [
    { name: '', title: '无' },
    { name: 'China', title: '中国' },
    { name: 'English', title: '英国' },
    { name: 'Japan', title: '日本' },
    { name: 'Korea', title: '韩国' },
    { name: 'Amarican', title: '美国' },
    { name: 'gat', title: '港澳台' },
  ],
  components: []
}

storage.prefix = store.app.storagePrefix
store.app.set('menuKey', storage.getValue('menu-key') || '/admin/home/dashboard')
store.app.set('baseUrl', process.env.NODE_ENV === 'development' ? 'http://localhost:8097' : '')
store.app.set('imageLine', process.env.NODE_ENV === 'development' ? 'http://localhost:8097' : '')
store.user.setToken(storage.getValue('user-token') || '')
store.user.setUsername(storage.getValue('user-username') || '')

// ws.on('log', function (data) {
//   if (data.type === 'log') {
//     store.logger.append(data);
//   } else if (data.type === 'update') {
//     store.logger.update(data.key, data)
//   } else if (data.type === 'close') {
//     store.logger.finish(data.key);
//   }
// })
export default store