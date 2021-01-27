import shttp from '../utils/shttp'

export function getConfigs() {
  return shttp({
    url: '/v1/admin/configs',
    method: 'GET',
  })
}

export function createConfig(data) {
  return shttp({
    url: `/v1/admin/config`,
    method: 'POST',
    data
  })
}

export function updateConfig(data) {
  return shttp({
    url: `/v1/admin/config/${data.id}`,
    method: 'PUT',
    data
  })
}

export function destroyConfig(data) {
  return shttp({
    url: `/v1/admin/config/${data.id}`,
    method: 'DELETE'
  })
}
