import shttp from '../utils/shttp'

export function getMedias(type, query) {
  let search = ''
  for (let k in query) {
    if (query[k]) {
      search += `&${k}=${query[k]}`
    }
  }
  return shttp({
    url: `/v1/admin/media/${type}/${search ? '?' + search.substr(1) : ''}`,
    method: 'GET'
  })
}
