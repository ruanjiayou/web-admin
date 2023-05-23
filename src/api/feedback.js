import shttp from '../utils/shttp'
import qs from 'querystring'

export function getFeedbacks(query) {
  const search = qs.stringify(query)
  return shttp({
    url: `/v1/admin/feedback?${search}`,
  })
}

export function createFeedback(data) {
  return shttp({
    url: `/v1/admin/feedback`,
    method: 'POST',
    data
  })
}

export function updateFeedback({id, ...data}) {
  return shttp({
    url: `/v1/admin/feedback/${id}`,
    method: 'PUT',
    data
  })
}

export function destroyFeedback(params) {
  return shttp({
    url: `/v1/admin/feedback/${params.id}`,
    method: 'DELETE',
  })
}
