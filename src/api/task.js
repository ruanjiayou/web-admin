import shttp from '../utils/shttp'

export function previewTask(query) {
  return shttp({
    url: `/v1/admin/novel-preview/?ruleId=${query.ruleId}&origin=${query.origin}`,
    method: 'GET',
  })
}
export function getTasks(query) {
  return shttp({
    url: `/v1/admin/tasks?resource_id=${query.resource_id}&type=${query.type}&status=${query.status}&page=${query.page}`,
    method: 'GET',
  })
}

export function updateTask(params) {
  const { id, ...data } = params
  return shttp({
    url: '/v1/admin/task/' + id,
    method: 'PUT',
    data,
  });
}

export function updateTaskResource(params) {
  const { id, ...data } = params
  return shttp({
    url: '/v1/admin/task-resource',
    method: 'PATCH',
    data,
  });
}
