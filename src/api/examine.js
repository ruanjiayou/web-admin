import shttp from '../utils/shttp'
import _ from 'lodash'
import qs from 'querystring'

export function getExamines() {
  return shttp({
    url: '/v1/admin/examines',
    method: 'GET',
  })
}

export function getExamine(id) {
  return shttp({
    url: '/v1/admin/examine/' + id,
    method: 'GET',
  })
}

export function createExamine(data) {
  const form = new FormData()
  for (let k in data) {
    let plainO = _.isPlainObject(data[k]) || _.isArray(data[k])
    form.append(k, plainO ? JSON.stringify(data[k]) : data[k])
  }
  return shttp({
    url: `/v1/admin/examine`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}


export function destroyExamine(id) {
  return shttp({
    url: '/v1/admin/examine/' + id,
    method: 'DELETE',
  })
}

export function updateExamine({ params, data }) {
  const form = new FormData()
  for (let k in data) {
    let plainO = _.isPlainObject(data[k]) || _.isArray(data[k])
    form.append(k, plainO ? JSON.stringify(data[k]) : data[k])
  }
  return shttp({
    url: `/v1/admin/examine/` + params.id,
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}

export function getQuestions({ params, query }) {
  return shttp({
    url: `/v1/admin/examine/${params.examId}/questions?` + qs.stringify(query),
    method: 'GET',
  })
}

export function createQuestion(data) {
  const form = new FormData()
  for (let k in data) {
    let plainO = _.isPlainObject(data[k]) || _.isArray(data[k])
    form.append(k, plainO ? JSON.stringify(data[k]) : data[k])
  }
  return shttp({
    url: `/v1/admin/examine/${data.examId}/question`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}


export function destroyQuestion(params) {
  return shttp({
    url: `/v1/admin/examine/${params.examId}/question/${params.id}`,
    method: 'DELETE',
  })
}

export function updateQuestion({ params, data }) {
  const form = new FormData()
  for (let k in data) {
    if (_.isArray(data[k])) {
      for (let i = 0; i < data[k].length; i++) {
        form.append(k, data[k][i])
      }
    } else if (_.isPlainObject(data[k])) {
      form.append(k, JSON.stringify(data[k]))
    } else {
      form.append(k, data[k])
    }
  }
  return shttp({
    url: `/v1/admin/examine/${params.examId}/question/${params.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}