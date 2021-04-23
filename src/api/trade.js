import shttp from '../utils/shttp'
const qs = require('querystring')

export function getTrades(query) {
  return shttp({
    url: `/v1/admin/trades?${qs.stringify(query)}`,
    method: 'GET',
  })
}

export function createTrade(data) {
  return shttp({
    url: `/v1/admin/trade`,
    method: 'POST',
    data
  })
}

export function updateTrade(data) {
  return shttp({
    url: `/v1/admin/trade/${data.id}`,
    method: 'PUT',
    data
  })
}

export function destroyTrade(data) {
  return shttp({
    url: `/v1/admin/trade/${data.id}`,
    method: 'DELETE',
    data
  })
}