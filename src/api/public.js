import shttp from '../utils/shttp'

export function getMenus(options = {}) {
  return shttp({
    method: 'GET',
    url: '/v1/public/menus'
  })
}

export function getMenuTree(options = {}) {
  return shttp({
    method: 'GET',
    url: '/v1/public/menu-tree'
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

export function getStocks({ query }) {
  return shttp({
    url: `/v1/public/stocks?q=${query.q || ''}`,
  })

}