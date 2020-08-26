import React, { Fragment } from 'react'
import { useLocalStore, Observer } from 'mobx-react-lite'
import { Tabs } from 'antd';
import TabPane from '../TabPane'
import { Icon, VisualBox } from '../../component'
import { createGroupByType } from '../../utils/helper'

export default function Tab({ self, children, ...props }) {
  const local = useLocalStore(() => ({
    activeKey: 1
  }))
  return (
    <Observer>{() => (
      <Tabs style={{ height: '100%' }} activeKey={local.activeKey} onChange={activeKey => local.activeKey = activeKey}>
        {self.children.map((child, index) => (
          <Tabs.TabPane style={{ height: '100%', minHeight: 200 }} key={index} tab={(<span>{child.title}</span>)} >
            <TabPane self={child} {...props} />
          </Tabs.TabPane>)
        )}
        {props.mode === 'edit' && <Tabs.TabPane key={-1} tab={<span onClick={e => { e.preventDefault(); e.stopPropagation(); props.addGroup(createGroupByType(self, '')) }}><Icon type="circle-plus" /></span>}></Tabs.TabPane>}
      </Tabs>
    )}</Observer>)
}