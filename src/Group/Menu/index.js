import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Icon } from '../../component'
import { contextMenu } from 'react-contexify';
import { useStore } from '../../contexts';

export default function Filter({ self, mode, ...props }) {
  const store = useStore()
  return <Observer>{() => (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Icon type="sync-horizon" />
      <span>{self.title}</span>
    </div>
  )
  }</Observer>
}