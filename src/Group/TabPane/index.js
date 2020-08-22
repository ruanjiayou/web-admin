import React from 'react'
import AutoView from '../AutoView'
import { Icon, VisualBox } from '../../component'

export default function TabPane({ self, children, ...props }) {
  return <div style={{ height: '100%' }}>
    {self.children.map(child => (
      <AutoView key={child.id} self={child} {...props} />
    ))}
    <VisualBox visuable={props.mode === 'edit'}></VisualBox>
    <div style={{ border: '1px dashed grey', textAlign: 'center' }}>
      <Icon type="plus" />
    </div>
  </div>
}