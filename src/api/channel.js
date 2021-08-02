import shttp from '../utils/shttp'

export function getChannels() {
  return shttp({
    url: '/v1/admin/channels',
    method: 'GET',
  })
}

export function createChannel(data) {
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
    url: '/v1/admin/channel',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function updateChannel(data) {
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
    url: `/v1/admin/channel/${data.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function updateChannels(list) {
  return shttp({
    url: `/v1/admin/channels`,
    method: 'PUT',
    data: list
  })
}

export function destroyChannel(data) {
  return shttp({
    url: `/v1/admin/channel/${data.id}`,
    method: 'DELETE'
  })
}

export function addTask(rule, origin) {
  return shttp({
    url: `/v1/admin/task/`,
    data: { origin, id: rule.id, type: rule.type },
    method: 'POST',
  })
}
