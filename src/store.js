import models from './models'
import storage from './utils/storage'
import { ws } from './utils/ws'

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
    { name: '', title: '全部' },
    { name: 'video', title: '视频' },
    { name: 'movie', title: '电影' },
    { name: 'image', title: '图片' },

    { name: 'animation', title: '动画' },
    { name: 'comic', title: '漫画' },
    { name: 'novel', title: '小说' },
    { name: 'article', title: '文章' },
    { name: 'post', title: '帖子' },
    { name: 'file', title: '文件' },
    { name: 'audio', title: '音频' },
    { name: 'music', title: '音乐' },

    { name: 'program', title: '节目' },
    { name: 'short', title: '短视频' },
    { name: 'series', title: '电视剧' },

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
  spiders: [],
  constant: {
    GW_DOWNLOAD: 'https://192.168.0.124/gw/download',
    RESOURCE_STATUS: {
      init: 1,
      loading: 2,
      fail: 3,
      finished: 4,
    },
    MEDIA_STATUS: {
      init: 1,
      loading: 2,
      fail: 3,
      finished: 4,
      transcoding: 5,
    },
    VIDEO_TYPE: {
      normal: 1, // 正片
      trailer: 2,// 预告
      tidbits: 3,// 花絮
      content: 4,// 正文
    },
    IMAGE_TYPE: {
      poster: 1,
      thumbnail: 2,
      content: 3,
      gallery: 4,
    },
    CHAPTER_TYPE: {
      chatper: 1,
      volume: 2,
    },
    MUSIC_TYPE: {
      audio: 1,
      mv: 2,
    },
    FILE_TYPE: {
      other: 0,
      text: 1,
      doc: 2,
      ppt: 3,
      execl: 4,
      image: 5,
      video: 6,
      torrent: 7,
      archive: 8,
      application: 9,
    },
  }
}

storage.prefix = store.app.storagePrefix
store.app.set('menuKey', storage.getValue('menu-key') || '/admin/home/resource-manage/list')
store.app.set('openKeys', storage.getValue('open-keys') || [])
// store.app.set('baseUrl', '/gw/admin')
// store.app.set('baseUrl', 'http://127.0.0.1:8097')
store.app.set('baseUrl', 'https://192.168.0.124/gw/novel')
store.app.set('imageLine', '')
store.user.setToken(storage.getValue('user-token') || '')
store.user.setAccount(storage.getValue('user-account') || '')

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