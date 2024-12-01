import shttp from '../utils/shttp'
import qs from 'querystring'

export function signIn({ data }) {
  return shttp({
    method: 'POST',
    url: '/v1/auth/user/sign-in',
    data,
  })
}

export function getUsers(query) {
  return shttp({
    url: `/v1/admin/users?${qs.stringify(query)}`,
    method: 'GET',
  })
}

export function createUser(data) {
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
    url: `/v1/admin/users`,
    method: 'POST',
    data: form
  })
}

export function updateUser(data) {
  const { _id, ...info } = data;
  const form = new FormData()
  for (let k in info) {
    if (info[k] instanceof Array) {
      info[k].forEach(v => {
        form.append(k, v)
      })
    } else {
      form.append(k, info[k])
    }

  }
  return shttp({
    url: `/v1/admin/users/${_id}`,
    method: 'PUT',
    data: form
  })
}

export function destroyUser(data) {
  return shttp({
    url: `/v1/admin/users/${data._id}`,
    method: 'DELETE',
    data
  })
}