import shttp from '../utils/shttp'
import * as backup from './backup'
import * as channel from './channel'
import * as group from './group'
import * as resource from './resource'
import * as spider from './spider'
import * as sync from './sync'
import * as user from './user'
import * as schedule from './schedule'
import * as link from './link'
import * as line from './line'
import * as pub from './public'
import * as config from './config'
import * as robot from './robot'
import * as file from './file'
import * as app from './app'
import * as search from './search'
import * as component from './component'
import * as feedback from './feedback'
import * as videoChapter from './video-chapter'
import * as media from './media'

const boot = function () {
  return shttp({
    url: '/v1/boot',
    method: 'GET'
  })
};

const excuteTemplate = async (id, data) => {
  return shttp({
    url: 'https://192.168.0.124/gw/download/ffmpeg/' + id,
    data,
    method: 'POST'
  })
}

const loadingInfo = async (filepath) => {
  return shttp({
    url: 'https://192.168.0.124/gw/download/ffmpeg/video-info-full',
    method: 'POST',
    data: { filepath }
  })
}

export default {
  boot,
  excuteTemplate,
  loadingInfo,
  ...app,
  ...backup,
  ...channel,
  ...group,
  ...resource,
  ...spider,
  ...sync,
  ...user,
  ...schedule,
  ...link,
  ...line,
  ...pub,
  ...config,
  ...robot,
  ...file,
  ...search,
  ...component,
  ...feedback,
  ...videoChapter,
  ...media,
}