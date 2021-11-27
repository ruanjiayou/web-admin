import shttp from '../utils/shttp'

export function getMenus(options = {}) {
  return shttp({
    method: 'GET',
    url: '/v1/public/menus'
  })
}

export function getCatagories() {
  return shttp({
    url: '/v1/public/categories',
    method: 'GET',
  })
}

export function fetchCrawler({ data }) {
  return shttp({
    url: '/v1/public/crawler',
    method: 'POST',
    data
  })
}

export function getGroupResources(id) {
  return shttp({
    url: `/v1/public/group/${id}/resources`,
  })
}