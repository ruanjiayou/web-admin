import shttp from '../utils/shttp'

export function getSyncs() {
  return shttp({
    url: '/v1/admin/syncs',
    method: 'GET',
  })
}

export function createSync(data) {
  data.condition = JSON.parse(data.condition)
  return shttp({
    url: `/v1/admin/sync`,
    method: 'POST',
    data
  })
}

export function destroySync(params) {
  return shttp({
    url: `/v1/admin/sync/${params.id}`,
    method: 'DELETE',
  })
}

export function updateSync(params) {
  params.condition = JSON.parse(params.condition)
  if (params.updatedAt) {
    params.updatedAt = new Date(params.updatedAt);
  }
  return shttp({
    url: `/v1/admin/sync/${params.id}`,
    method: 'PUT',
    data: params
  })
}

export function syncOne(params) {
  return shttp({
    url: `/v1/admin/sync-resource/${params.id}`,
    method: 'PUT'
  })
}

export function sync2prod(params) {
  return shttp({
    url: '/v1/admin/sync2prod/' + params.id,
    method: 'PUT',
  })
}

export function sync2dev(params) {
  return shttp({
    url: '/v1/admin/sync2dev/' + params.id,
    method: 'PUT',
  })
}

export function sync2es(params) {
  return shttp({
    url: '/v1/admin/resources/sync',
    method: 'post',
    data: params
  })
}