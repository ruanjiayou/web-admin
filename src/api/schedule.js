import shttp from '../utils/shttp'

export function getSchedules() {
  return shttp({
    url: `/v1/admin/schedules`,
    method: 'GET'
  })
}

export function tickSchedule(data) {
  return shttp({
    url: `/v1/admin/schedule/${data.name}`,
    method: 'PATCH',
  })
}

export function createSchedule(data) {
  return shttp({
    url: `/v1/admin/schedule`,
    method: 'post',
    data
  })
}
export function updateSchedule(_id, data) {
  return shttp({
    url: `/v1/admin/schedule/${_id}`,
    method: 'put',
    data
  })
}

export function switchSchedule(_id, status) {
  return shttp({
    url: `/v1/admin/schedule/${_id}/status`,
    method: 'post',
    data: { status }
  })
}
