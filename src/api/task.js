import shttp from '../utils/shttp'

export function getTasks(query) {
  return shttp({
    url: `/v1/admin/tasks?resource_id=${query.resource_id}&page=${query.page}`,
    method: 'GET',
  })
}

export function updateTask(data) {
  return shttp({
    url: 'v1/admin/task',
    method: 'PUT',
    data,
  });
}

export function updateTaskResource(data) {
  return shttp({
    url: 'v1/admin/task-resource',
    method: 'PUT',
    data,
  });
}

export function destroyTask(data) {
  return shttp({
    url: 'v1/admin/task',
    method: 'DELETE',
    data,
  });
}
