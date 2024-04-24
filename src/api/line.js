import shttp from '../utils/shttp'

export function getLines(query) {
  return shttp({
    url: `/v1/admin/lines`,
    method: 'GET',
  })
}

export function createLine(data) {
  return shttp({
    url: `/v1/admin/line`,
    method: 'POST',
    data
  })
}

export function updateLine(data) {
  return shttp({
    url: `/v1/admin/line/${data._id}`,
    method: 'PUT',
    data
  })
}

export function destroyLine(data) {
  return shttp({
    url: `/v1/admin/line/${data._id}`,
    method: 'DELETE',
    data
  })
}