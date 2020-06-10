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

export function updateSyncProd(params) {
  return shttp({
    url: '/v1/admin/sync-prod/' + params.id,
    method: 'PUT',
  })
}

export function updateSyncDev(params) {
  return shttp({
    url: '/v1/admin/sync-dev/' + params.id,
    method: 'PUT',
  })
}
