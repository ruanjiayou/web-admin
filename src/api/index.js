import shttp from '../utils/shttp'

export function getMenu({ query, param, data }) {
  return shttp({
    method: 'GET',
    url: '/v1/public/menu'
  })
}

export function signIn({ data }) {
  return shttp({
    method: 'POST',
    url: '/v1/auth/user/sign-in',
    data,
  })
}