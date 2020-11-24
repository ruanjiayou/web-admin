import shttp from '../utils/shttp'
import * as backup from './backup'
import * as channel from './channel'
import * as group from './group'
import * as resource from './resource'
import * as rule from './rule'
import * as sync from './sync'
import * as task from './task'
import * as trade from './trade'
import * as user from './user'
import * as schedule from './schedule'
import * as examine from './examine'
import * as link from './link'

const boot = function () {
  return shttp({
    url: '/v1/boot',
    method: 'GET'
  })
};

const analyise = function () {
  return shttp({
    url: '/v1/admin/analyise/trade',
    method: 'GET'
  })
};

export default {
  boot,
  analyise,
  ...backup,
  ...channel,
  ...group,
  ...resource,
  ...rule,
  ...sync,
  ...task,
  ...trade,
  ...user,
  ...schedule,
  ...examine,
  ...link,
}