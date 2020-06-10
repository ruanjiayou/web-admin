import shttp from '../utils/shttp'

export function getMenu({ query, param, data }) {
  return shttp({
    method: 'GET',
    url: '/v1/public/menu'
  })
}

export function getCatagories() {
  return shttp({
    url: '/v1/public/categories',
    method: 'GET',
  })
}
