import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Tag } from 'antd'
import VisualBox from '../../component/VisualBox'
import Icon from '../../component/Icon'
import { contextMenu } from 'react-contexify';
import { useStore } from '../../contexts';
import { EditWrap } from '../style'

export default function Filter({ self, remove, mode, ...props }) {
  const store = useStore()
  return <Observer>{() => (
    <EditWrap className={store.app.currentEditGroupId === self.id ? 'focus' : ''}>
      <Tag
        onContextMenu={e => {
          if (mode === 'preview') return;
          e.preventDefault();
          contextMenu.show({
            id: 'group_menu',
            event: e,
            props: {
              id: self.id,
              view: self.view
            }
          });
        }}
        closable={mode === 'edit'}
        onClose={() => {
          if(self.$new) {
            remove()
          } else {
            props.destroyGroup({ id: self.id })
          }
        }}
        onClick={e => { e.preventDefault(); e.stopPropagation(); }}
        style={{ backgroundColor: self.attrs.selected === true ? 'pink' : '', color: self.attrs.selected ? 'red' : '', marginRight: 0 }}>
        <span onClick={() => {
          // self.selectMe()
          // props.selectMe(self.id)
        }}>
          {self.title}
        </span>
      </Tag >
    </EditWrap>
  )
  }</Observer>
}