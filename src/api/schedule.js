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

export function switchSchedule(data) {
  return shttp({
    url: `/v1/admin/schedule/${data.name}`,
    method: 'PUT',
  })
}
