import shttp from '../utils/shttp'

export function createRule(data) {
  return shttp({
    url: '/v1/admin/rule',
    method: 'POST',
    data
  })
}

export function destroyRule(params) {
  return shttp({
    url: `/v1/admin/rule/${params.id}`,
    method: 'DELETE',
  })
}

export function updateRule(data) {
  return shttp({
    url: `/v1/admin/rule`,
    method: 'PUT',
    data,
  })
}

export function getRules() {
  return shttp({
    url: '/v1/admin/rules',
    method: 'GET',
  })
}
