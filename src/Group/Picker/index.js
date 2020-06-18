import React from 'react'
import VisualBox from '../../component/VisualBox'
import ItemView from '../BookItem/Normal'
import Icon from '../../component/Icon'
import { AlignAside, FullWidth } from '../../component/style'

export default function Picker({ self }) {
  return <div>
    <VisualBox visible={self.attrs.hide_title === false}>
      <AlignAside style={{ borderLeft: '5px solid #ff9999', padding: '5px 8px' }}>
        <span>{self.title}</span>
        <VisualBox visible={self.more.channel_id !== ''}>
          <span style={{ fontSize: 13, color: '#888' }}>更多 <Icon type="arrow-right" /></span>
        </VisualBox>
      </AlignAside>
    </VisualBox>
    <FullWidth style={{ overflowX: 'auto' }}>
      {self.data.map((d, index) => (<ItemView style={{ width: '50%' }} key={index} item={d} />))}
    </FullWidth>
    <VisualBox visible={self.attrs.allowChange === true}>
      <div style={{ textAlign: 'center' }}><Icon type="sync-horizon" /> 换一换</div>
    </VisualBox>
  </div>
}