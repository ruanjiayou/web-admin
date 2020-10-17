import shttp from '../utils/shttp'

export function getChannels() {
  return shttp({
    url: '/v1/admin/channels',
    method: 'GET',
  })
}

export function createChannel(data) {
  return shttp({
    url: '/v1/admin/channel',
    method: 'POST',
    data
  })
}

export function updateChannel(data) {
  return shttp({
    url: `/v1/admin/channel/${data.id}`,
    method: 'PUT',
    data
  })
}

export function updateChannels(list) {
  return shttp({
    url: `/v1/admin/channels`,
    method: 'PUT',
    data: list
  })
}

export function destroyChannel(data) {
  return shttp({
    url: `/v1/admin/channel/${data.id}`,
    method: 'DELETE'
  })
}

export function addTask(rule, origin) {
  return shttp({
    url: `/v1/admin/task/`,
    data: { origin, id: rule.id },
    method: 'POST',
  })
}
