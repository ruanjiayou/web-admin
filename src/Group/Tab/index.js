import React, { Fragment } from 'react'
import { Tabs } from 'antd';
import TabPane from '../TabPane'
import Icon from '../../component/Icon'

export default function Tab({ self, children, ...props }) {
  return (
    <Fragment>
      <Tabs>{
        self.children.map((child, index) => (
          <Tabs.TabPane key={index} tab={(
            <div>
              <span>{child.title}</span>
              {props.mode === 'edit' && <Icon type="circle-plus" onClick={e => {
                e.preventDefault()
                props.addGroup({ parent_id: child.id, tree_id: child.tree_id })
              }} />}
            </div>)} >
            <TabPane self={child} {...props} />
          </Tabs.TabPane>)
        )
      }</Tabs>
    </Fragment>)

}