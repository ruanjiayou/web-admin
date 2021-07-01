import shttp from '../utils/shttp'

export function createRule(data) {
  return shttp({
    url: '/v1/admin/rule',
    method: 'POST',
    data
  })
}

export function destroyRule(params) {
  return shttp({
    url: `/v1/admin/rule/${params.id}`,
    method: 'DELETE',
  })
}

export function updateRule(data) {
  return shttp({
    url: `/v1/admin/rule`,
    method: 'PUT',
    data,
  })
}

export function getRules() {
  return shttp({
    url: '/v1/admin/rules',
    method: 'GET',
  })
}

export function v2createRule(data) {
  const form = new FormData()
  for (let k in data) {
    let v = data[k]
    if (((k === 'subScript' || k === 'mainScript') && !v) || v) {
      form.append(k, v)
    }
  }
  return shttp({
    url: `/v2/admin/rule`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function v2destroyRule(params) {
  return shttp({
    url: `/v2/admin/rule/${params.id}`,
    method: 'DELETE',
  })
}

export function v2updateRule(data) {
  const form = new FormData()
  for (let k in data) {
    let v = data[k]
    if (((k === 'subScript' || k === 'mainScript') && !v) || v) {
      form.append(k, v)
    }
  }
  return shttp({
    url: `/v2/admin/rule/${data.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function v2getRules() {
  return shttp({
    url: '/v2/admin/rules',
    method: 'GET',
  })
}
