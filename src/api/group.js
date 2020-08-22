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


export function getGroupTrees({ query }) {
  return shttp({
    url: `/v1/admin/group-trees?v=${query.v}`,
    method: 'GET',
  })
}

function each(group, data, del = false) {
  const g = group.toJSON()
  if (group.$new) {
    data.create.push(g)
  } else if (group.$delete || del) {
    data.delete.push({ id: group.id })
    del = true
  } else if (group.diff()) {
    data.update.push(g);
  }
  group.children.forEach(child => {
    each(child, data, del);
  })
}
export function updateGroupTree(tree) {
  const data = {
    delete: [],
    create: [],
    update: [],
  }
  each(tree, data, false);
  return shttp({
    url: `/v1/admin/group-tree`,
    method: 'PUT',
    data,
  })
}