import shttp from '../utils/shttp'

export function getComponents() {
  return shttp({
    url: '/v1/admin/components',
    method: 'GET',
  })
}

export function createComponent(data) {
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
    url: '/v1/admin/component',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function updateComponent(data) {
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
    url: `/v1/admin/component/${data.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function updateComponents(list) {
  return shttp({
    url: `/v1/admin/components`,
    method: 'PUT',
    data: list
  })
}

export function destroyComponent(data) {
  return shttp({
    url: `/v1/admin/component/${data.id}`,
    method: 'DELETE'
  })
}
