import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Tag } from 'antd'
import VisualBox from '../../component/VisualBox'
import Icon from '../../component/Icon'
import { contextMenu } from 'react-contexify';

export default function Filter({ self, mode, ...props }) {
  return <Observer>{() => (
    <Tag
      onContextMenu={e => {
        if (mode === 'preview') return;
        e.preventDefault();
        contextMenu.show({
          id: 'group_menu',
          event: e,
          props: {
            id: self.id,
            view: self.attrs.view
          }
        });
      }}
      onClick={e => { e.preventDefault(); e.stopPropagation(); }}
      style={{ backgroundColor: self.attrs.selected === true ? 'pink' : '', color: self.attrs.selected ? 'red' : '', marginRight: 0 }}>
      <span onClick={() => {
        // self.selectMe()
        // props.selectMe(self.id)
      }}>
        {self.title}
      </span>
    </Tag >)
  }</Observer>
}