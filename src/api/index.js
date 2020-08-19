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

// resource types
// image line
// 
function boot() {
  return shttp({
    url: '/v1/boot',
    method: 'GET'
  })
}

export default {
  boot,
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
}