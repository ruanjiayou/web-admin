import shttp from '../utils/shttp'
import qs from 'querystring'

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
  return shttp({
    url: `/v2/admin/rule/${data.id}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data,
  })
}

export function v2getRules() {
  return shttp({
    url: '/v2/admin/rules',
    method: 'GET',
  })
}

export function v2GetResourceByRule(ruleId, url) {
  return shttp({
    url: '/v2/admin/rule/' + ruleId,
    method: 'PATCH',
    data: {
      origin: url,
    }
  })
}

export function v2getRuleCode(ruleId) {
  return shttp({
    url: `/v2/admin/rules/${ruleId}/code`,
    method: 'GET',
  })
}

export function v2UpdateRuleCode(ruleId, code) {
  return shttp({
    url: `/v2/admin/rules/${ruleId}/code`,
    method: 'PUT',
    data: { code }
  })
}

export function v2previewRule(ruleId, query) {
  return shttp({
    url: `/v2/admin/rule/${ruleId}/preview?${qs.stringify(query)}`,
    method: 'GET',
  })
}