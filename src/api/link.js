import shttp from '../utils/shttp'

export function getLinks(query) {
  return shttp({
    url: `/v1/admin/links`,
    method: 'GET',
  })
}

export function createLink(data) {
  return shttp({
    url: `/v1/admin/link`,
    method: 'POST',
    data
  })
}

export function updateLink(data) {
  return shttp({
    url: `/v1/admin/link/${data.id}`,
    method: 'PUT',
    data
  })
}

export function destroyLink(data) {
  return shttp({
    url: `/v1/admin/link/${data.id}`,
    method: 'DELETE',
    data
  })
}