import React from 'react'
import AutoView from '../AutoView'

export default function TabPane({ self, children, ...props }) {
  return self.children.map(child => (
    <AutoView key={child.id} self={child} {...props} />
  ))
}