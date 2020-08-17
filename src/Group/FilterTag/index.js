import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Tag } from 'antd'
import VisualBox from '../../component/VisualBox'
import Icon from '../../component/Icon'

export default function Filter({ self, mode, ...props }) {
  return <Observer>{() => (
    <Tag
      style={self.attrs.selected === true ? { backgroundColor: 'pink', color: 'red' } : {}}
      closable={mode === 'edit'}
      onClose={() => {
        props.destroyGroup({ id: self.id })
      }}>
      <span onClick={() => {
        // self.selectMe()
        // props.selectMe(self.id)
      }}>
        {self.title}
      </span>
      {/* <VisualBox visible={mode === 'edit'}>
        <Icon type="edit" onClick={() => props.editGroup(self)} />
      </VisualBox> */}
    </Tag >)
  }</Observer>
}