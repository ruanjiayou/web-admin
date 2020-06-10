import shttp from '../utils/shttp'

export function createGroup(data) {
  return shttp({
    url: `/v1/admin/group`,
    method: 'POST',
    data
  })
}

export function updateGroup(data) {
  return shttp({
    url: `/v1/admin/group/${data.id}`,
    method: 'PUT',
    data
  })
}

export function destroyGroup(params) {
  return shttp({
    url: `/v1/admin/group/${params.id}`,
    method: 'DELETE',
  })
}


export function getGroupTrees() {
  return shttp({
    url: `/v1/admin/group-trees`,
    method: 'GET',
  })
}
