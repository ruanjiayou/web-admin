import React, { useContext } from 'react'

const context = React.createContext(null)

export function createRouter(history) {
  const router = {
    history,
    state(key) {
      return history.location.state && history.location.state[key]
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