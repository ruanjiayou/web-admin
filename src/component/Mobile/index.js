import React from 'react'

export default function ({ children, style }) {
  return <div style={{ width: 480, height: 640, overflow: 'auto', ...style }}>
    {children}
  </div>
}