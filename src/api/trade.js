import shttp from '../utils/shttp'

export function getTrades(query) {
  return shttp({
    url: `/v1/admin/trades`,
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