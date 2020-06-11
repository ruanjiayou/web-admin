import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'

export default function ({ visible, children }) {
  return <Observer>
    {() => {
      return <Fragment>
        {visible && children}
      </Fragment>
    }}
  </Observer>
}