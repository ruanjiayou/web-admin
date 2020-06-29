import mock from 'mockjs'

mock.setup({
  timeout: '200-600'
})

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
  path: '/admin/home/dashboard',
  sub: [],
}))

mock.mock('/v1/auth/user/sign-in', success({
  token: 'xxxxx',
  username: 'admin',
}))

mock.mock('/v1/admin/backups', success([]))
mock.mock('/v1/admin/syncs', success([]))
mock.mock('/v1/admin/rules', success([]))
mock.mock('/v1/admin/tasks', success([]))