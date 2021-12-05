import shttp from '../utils/shttp'

export function getApps() {
  return shttp({
    url: '/v1/admin/apps',
    method: 'GET',
  })
}

export function getApp(id) {
  return shttp({
    url: '/v1/admin/apps/' + id,
    method: 'GET',
  })
}

export function createApp(data) {
  const form = new FormData()
  for (let k in data) {
    if (data[k] instanceof Array) {
      data[k].forEach(v => {
        form.append(k, v)
      })
    } else {
      form.append(k, data[k])
    }

  }
  return shttp({
    url: '/v1/admin/apps',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function updateApp(data) {
  const form = new FormData()
  for (let k in data) {
    if (data[k] instanceof Array) {
      data[k].forEach(v => {
        form.append(k, v)
      })
    } else {
      form.append(k, data[k])
    }

  }
  return shttp({
    url: `/v1/admin/apps/${data.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function destroyApp(data) {
  return shttp({
    url: `/v1/admin/apps/${data.id}`,
    method: 'DELETE'
  })
}
