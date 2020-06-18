import React from 'react'
import { Observer } from 'mobx-react-lite';
import { AlignAside } from '../../component/style'
import { Line2 } from './style'

export default function BookItemNormal({ item, style }) {
  return <Observer>{() => (
    <AlignAside style={{ ...style }}>
      <div>
        <img style={{ width: 70, height: 90, margin: 10 }} src={item.cover} />
      </div>
      <div style={{ flex: 1, fontSize: 16 }}>
        <div style={{ color: 'black', fontWeight: 'bold' }}>{item.title}</div>
        <div>{item.uname}·{item.catalog}·{item.status === 'loading' ? '连载' : '完结'}·{item.words}</div>
        <Line2 style={{ fontSize: 14 }}>{item.desc}</Line2>
      </div>
    </AlignAside>
  )}</Observer>
}