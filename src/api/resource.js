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
    url: `/v1/admin/resource/${query._id}`,
    method: 'GET'
  })
}

export function getVideo(_id) {
  return shttp({
    url: `/v1/admin/video/${_id}`
  })
}

export function createResource(data) {
  const form = new FormData()
  for (let k in data) {
    if (data[k] instanceof File || data[k] instanceof Blob) {
      form.append(k, data[k])
    } else if (data[k] instanceof Array) {
      data[k].forEach(v => {
        form.append(k, v)
      })
    } else {
      form.append(k, data[k]);
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

export function updateResource(data, sync = false) {
  const form = new FormData()
  for (let k in data) {
    if (data[k] instanceof File || data[k] instanceof Blob) {
      form.append(k, data[k])
    } else if (data[k] instanceof Array) {
      data[k].forEach(v => {
        form.append(k, v)
      })
    } else {
      form.append(k, data[k]);
    }
  }
  return shttp({
    url: `/v1/admin/resource/${data._id}${sync ? '?sync=true' : ''}`,
    method: 'PUT',
    data: form
  })
}

export function destroyResource(params) {
  return shttp({
    url: `/v1/admin/resource/${params._id}`,
    method: 'DELETE',
  })
}

export function updateResourceChapter(_id, data) {
  return shttp({
    url: `/v1/admin/resource/${_id}/chapter/${data._id}`,
    method: 'PUT',
    data,
  })
}

export function updateResourceActor(_id, data) {
  return shttp({
    url: `/v1/admin/resource/${_id}/actors`,
    method: 'PUT',
    data,
  })
}

export function addResourceVideo({ _id, ...data }) {
  return shttp({
    url: `/v1/admin/resource/${_id}/video`,
    method: 'POST',
    data,
  })
}

export function updateResourceVideo(_id, data) {
  return shttp({
    url: `/v1/admin/resource/${_id}/video/${data._id}`,
    method: 'PUT',
    data,
  })
}

export function downloadResourceVideo(mid, _id) {
  return shttp({
    url: `/v1/admin/resource/${mid}/video/${_id}`,
    method: 'PATCH',
  })
}

export function downloadVideoSubtitles({ _id, mid, subtitles }) {
  return shttp({
    url: `/v1/admin/resource/${mid}/video/${_id}/subtitles`,
    data: { subtitles },
    method: 'PATCH',
  })
}

export function downloadResourceCover({ _id }) {
  return shttp({
    url: `/v1/admin/resource/${_id}/cover`,
    method: 'PATCH',
  })
}
export function removeResourceVideo({ _id, mid }) {
  return shttp({
    url: `/v1/admin/resource/${mid}/video/${_id}`,
    method: 'DELETE',
  })
}

export function sortSubResource(_id, type, batch) {
  return shttp({
    url: `/v1/admin/resource/${_id}/sort/${type}`,
    method: 'PUT',
    data: batch,
  });
}

export function sortResourceVideo({ _id, data }) {
  return shttp({
    url: `/v1/admin/resource/${_id}/video`,
    method: 'PUT',
    data,
  })
}


export function addResourceImage({ _id, ...data }) {
  return shttp({
    url: `/v1/admin/resource/${_id}/image`,
    method: 'POST',
    data,
  })
}

export function updateResourceImage(_id, data) {
  return shttp({
    url: `/v1/admin/resource/${_id}/image/${data._id}`,
    method: 'PUT',
    data,
  })
}

export function downloadResourceImage(mid, _id) {
  return shttp({
    url: `/v1/admin/resource/${mid}/image/${_id}`,
    method: 'PATCH',
  })
}

export function removeResourceImage({ _id, mid }) {
  return shttp({
    url: `/v1/admin/resource/${mid}/image/${_id}`,
    method: 'DELETE',
  })
}

export function sortResourceImage({ _id, data }) {
  return shttp({
    url: `/v1/admin/resource/${_id}/image`,
    method: 'PUT',
    data,
  })
}

export function addResourceAudio(_id, data) {
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
    url: `/v1/admin/resource/${_id}/audio`,
    method: 'POST',
    data: form,
  })
}

export function updateResourceAudio(_id, data) {
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
    url: `/v1/admin/resource/${_id}/audio/${data._id}`,
    method: 'PUT',
    data: form,
  })
}

export function removeResourceAudio({ _id, mid }) {
  return shttp({
    url: `/v1/admin/resource/${mid}/audio/${_id}`,
    method: 'DELETE',
  })
}

export function grabImages(params) {
  return shttp({
    url: `/v1/admin/resource-grab-images/${params._id}`,
    method: 'GET',
  })
}