import shttp from '../utils/shttp'

export function getSpiders(query) {
  return shttp.get('/v1/admin/spider', query)
}
export function createSpider(data) {
  return shttp.post('/v1/admin/spider', data)
}
export function destroySpider(data) {
  return shttp.delete(`/v1/admin/spider/${data._id}`)
}
export function updateSpider(_id, data) {
  return shttp.put(`/v1/admin/spider/${_id}`, data)
}
export function patchSpider(_id, data, preview) {
  return shttp.patch(`/v1/admin/spider/${_id}?preview=${preview ? 1 : ''}`, data)
}