import React from 'react'
import { Observer } from 'mobx-react-lite'
import { VisualBox, Icon } from '../../component'
import ItemView from '../BookItem/Normal'
import { AlignAside, FullWidth } from '../../component/style'
import { contextMenu } from 'react-contexify';

export default function Picker({ self, ...props }) {
  return <Observer>{() => (
    <div>
      <VisualBox visible={props.mode === 'edit'}>
        <AlignAside style={{ border: '1px dashed grey', padding: '2px 5px' }}>
          <Icon type="edit" onClick={e => {
            if (props.mode === 'preview') return;
            e.preventDefault();
            contextMenu.show({
              id: 'group_menu',
              event: e,
              props: {
                id: self.id,
                view: self.attrs.view
              }
            });
          }} />
          <Icon type="delete" />
        </AlignAside>
      </VisualBox>
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
  )}</Observer>
}