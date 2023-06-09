import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Icon } from '../../component'

export default function Filter({ self, mode, ...props }) {
  return <Observer>{() => (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Icon type="sync-horizon" />
      <span>{self.title}</span>
    </div>
  )
  }</Observer>
}