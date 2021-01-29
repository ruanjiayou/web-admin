import shttp from '../utils/shttp'

export function getRobots() {
  return shttp({
    url: '/v1/admin/qq-robots',
    method: 'GET',
  })
}
// uin type msg
export function sendRobotMsg({ params, data }) {
  return shttp({
    url: `/v1/admin/qq-robot/${params.uin}/send-msg`,
    method: 'POST',
    data
  })
}

export function sendRobotCMD({ params, data }) {
  return shttp({
    url: `/v1/admin/qq-robot/${params.uin}/cmd/${params.cmd}`,
    method: 'POST',
    data
  })
}

export function getFriends({ params }) {
  return shttp({
    url: `/v1/admin/qq-robot/${params.uin}/friends`,
    method: 'GET',
  })
}

export function addFriend({ params, data }) {
  return shttp({
    url: `/v1/admin/qq-robot/${params.uin}/friend`,
    method: 'POST',
    data,
  })
}

export function removeFriend({ params, data }) {
  return shttp({
    url: `/v1/admin/qq-robot/${params.uin}/friend`,
    method: 'DELETE',
    data,
  })
}
