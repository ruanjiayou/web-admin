import shttp from '../utils/shttp'

export function signIn({ data }) {
  return shttp({
    method: 'POST',
    url: '/v1/auth/user/sign-in',
    data,
  })
}