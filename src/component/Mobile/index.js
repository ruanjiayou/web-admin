import React from 'react'

export default function ({ children, style }) {
  return <div style={{ width: 480, height: 480, overflow: 'auto', ...style }}>
    {children}
  </div>
}