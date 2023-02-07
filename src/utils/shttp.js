import axios from 'axios'
import store from '../store'

const shttp = axios.create({
  baseURL: store.app.baseUrl,
  withCredentials: false,
  // timeout: 5000
})

shttp.interceptors.request.use(config => {
  console.log(`${config.method} ${config.url}`)
  config.headers['Authorization'] = store.user.token
  return config
}, error => {
  console.log(error.message, 'request error')
})

shttp.interceptors.response.use(response => {
  // TODO: 刷新token
  return response.data
}, (error) => {
  if(error.response.status === 400) {
    return Promise.resolve(error.response.data)
  }
  return Promise.reject(error)
})

export default shttp