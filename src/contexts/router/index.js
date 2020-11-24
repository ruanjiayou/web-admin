import React, { useContext } from 'react'
import qs from 'qs'

const context = React.createContext(null)

export function createRouter(history) {
  const router = {
    history,
    state(key) {
      return history.location.state && history.location.state[key]
    },
    get pathname() {
      return history.location.pathname
    },
    getQuery(uri) {
      const url = history.location.pathname + history.location.search;
      const [pathname, querystring = ''] = (uri || url).split('?')
      return qs.parse(querystring, { allowDots: true })
    },
    goBack() {

    },
    goRoot() {
      history.push('/', '', {})
    },
    goPage(pathname, search, state) {
      history.push(pathname, search, state)
    },
    replacePage() {

    },
  }
  return [router, context]
}

export function useRouter() {
  return useContext(context)
}