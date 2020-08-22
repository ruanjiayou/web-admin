import React, { Fragment } from 'react'
import { Tabs } from 'antd';
import TabPane from '../TabPane'
import { Icon, VisualBox } from '../../component'

export default function Tab({ self, children, ...props }) {
  return (
    <Fragment>
      <Tabs style={{ height: '100%' }}>
        {self.children.map((child, index) => (
          <Tabs.TabPane style={{ height: '100%' }} key={index} tab={(<span>{child.title}</span>)} >
            <TabPane self={child} {...props} />
          </Tabs.TabPane>)
        )}
        {props.mode === 'edit' && <Tabs.TabPane key={-1} tab={<span onClick={e => { e.preventDefault(); e.stopPropagation(); props.addGroup({ parent_id: self.id, tree_id: self.tree_id }) }}><Icon type="circle-plus" /></span>}></Tabs.TabPane>}
      </Tabs>
    </Fragment>)

}