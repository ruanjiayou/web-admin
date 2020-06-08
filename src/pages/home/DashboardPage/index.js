import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useStore } from '../../../contexts'

export default function SignInPage() {
  const store = useStore()
  return <Observer>{() => (
    <Fragment>
      <div>Hello, World! {store.config.name}</div>
    </Fragment>
  )}</Observer>
}