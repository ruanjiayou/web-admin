import React, { useContext } from 'react'
import store from '../../store'

const context = React.createContext(null)

export function createStore() {
  return [store, context]
}

export function useStore() {
  return useContext(context)
}