import shttp from '../utils/shttp'

export function getResources(query) {
  let search = ''
  for (let k in query) {
    if (query[k]) {
      search += `&${k}=${query[k]}`
    }
  }
  return shttp({
    url: `/v1/admin/resources${search ? '?' + search.substr(1) : ''}`,
    method: 'GET'
  })
}

export function getResource(query) {
  return shttp({
    url: `/v1/admin/resource/${query.id}`,
    method: 'GET'
  })
}

export function createResource(data) {
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
    url: `/v1/admin/resource`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function updateResource(data) {
  const form = new FormData()
  for (let k in data) {
    if (data[k] instanceof Array) {
      for (let i = 0; i < data[k].length; i++) {
        form.append(k, data[k][i])
      }
    } else {
      form.append(k, data[k])
    }
  }
  return shttp({
    url: `/v1/admin/resource/${data.id}`,
    method: 'PUT',
    data: form
  })
}

export function destroyResource(params) {
  return shttp({
    url: `/v1/admin/resource/${params.id}`,
    method: 'DELETE',
  })
}

export function addResourceVideo({ id, ...data }) {
  return shttp({
    url: `/v1/admin/resource/${id}/video`,
    method: 'POST',
    data,
  })
}

export function updateResourceVideo(id, data) {
  return shttp({
    url: `/v1/admin/resource/${id}/video/${data.id}`,
    method: 'PUT',
    data,
  })
}

export function downloadResourceVideo(mid, id) {
  return shttp({
    url: `/v1/admin/resource/${mid}/video/${id}`,
    method: 'PATCH',
  })
}

export function downloadResourceCover({ id }) {
  return shttp({
    url: `/v1/admin/resource/${id}/cover`,
    method: 'PATCH',
  })
}
export function removeResourceVideo({ id, mid }) {
  return shttp({
    url: `/v1/admin/resource/${mid}/video`,
    method: 'DELETE',
    data: { id }
  })
}

export function sortResourceVideo({ id, data }) {
  return shttp({
    url: `/v1/admin/resource/${id}/video`,
    method: 'PUT',
    data,
  })
}

export function grabImages(params) {
  return shttp({
    url: `/v1/admin/resource-grab-images/${params.id}`,
    method: 'GET',
  })
}