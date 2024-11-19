import shttp from '../utils/shttp'

export function putVideoChapter(data) {
  return shttp({
    url: `/v1/admin/video/${data.mid}/chapter`,
    method: 'PUT',
    data,
  })
}

export function delVideoChapter(mid, id) {
  return shttp({
    url: `/v1/admin/video/${mid}/chapter/${id}`,
    method: 'DELETE',
  })
}