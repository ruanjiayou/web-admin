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
    { name: 'movie', title: '电影' },
    { name: 'program', title: '节目' },
    { name: 'animation', title: '动画' },
    { name: 'short', title: '短视频' },
    { name: 'series', title: '电视剧' },

    { name: 'novel', title: '小说' },
    { name: 'article', title: '文章' },
    { name: 'private', title: '私人' },
  ],
  medias: [
    // audip:mp3, video:mp4, image:jpg,png, txt: html,js, binary: zip,torrent, doc,pdf
  ],
  regions: [
    { name: '', title: '无' },
    { name: 'CN', title: '中国' },
    { name: 'JP', title: '日本' },
    { name: 'HK', title: '香港' },
    { name: 'US', title: '美国' },
    { name: 'KR', title: '韩国' },
    { name: 'TW', title: '台湾' },
    { name: 'GB', title: '英国' },
    { name: 'IN', title: '印度' },
    { name: 'FR', title: '法国' },
    { name: 'AO', title: '澳门' },
  ],
  components: [],
  rules: [],
}

storage.prefix = store.app.storagePrefix
store.app.set('menuKey', storage.getValue('menu-key') || '/admin/home/resource-manage/list')
store.app.set('baseUrl', '/gw/admin')
store.app.set('imageLine', '')
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