import mock from 'mockjs'

function success(data) {
  return {
    code: 0,
    data,
  }
}

function error(err) {
  return {
    code: err.code,
    message: err.message,
  }
}

mock.mock('/v1/public/menu', success({
  title: '总揽',
  name: 'dashboard',
  icon: '',
  path: '/home/dashboard',
  sub: [],
}))

mock.mock('/v1/auth/user/sign-in', success({
  token: 'xxxxx',
  username: 'admin',
}))