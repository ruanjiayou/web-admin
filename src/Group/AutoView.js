import React, { Fragment } from 'react'
import { Divider } from 'antd';
import Icon from '../component/Icon'
import Picker from './Picker'
import Filter from './Filter'
import FilterRow from './FilterRow'
import FilterTag from './FilterTag'
import Tree from './Tree'
import Tab from './Tab'
import TabPane from './TabPane'

// README: subView一般在父view处理视图.这里还列出来是编辑添加时要用于显示.
export const mapping = {
  'picker': {
    name: '人工手选',
    component: Picker
  },
  'filter': {
    name: '复合过滤',
    subView: 'filter-row',
    component: Filter
  },
  'filter-row': {
    name: '单种过滤',
    subView: 'filter-tag',
    component: FilterRow
  },
  'filter-tag': {
    name: '单个条件',
    component: FilterTag
  },
  'tree-node': {
    name: '树节点',
    component: Tree,
  },
  'tab': {
    name: 'tab',
    subView: 'tab-pane',
    component: Tab,
  },
  'tab-pane': {
    name: 'tab-pane',
    component: TabPane,
  },
}

// self children mode 
export default function AutoView({ self, children, ...props }) {
  if (self) {
    if (self.parent_id === '') {
      return self.children.map(child => (
        <AutoView
          key={child.id}
          self={child}
          {...props}
        />
      ))
    } else {
      let view = self.view
      let Comp = mapping[view] ? mapping[view].component : null
      if (Comp) {
        return (
          <Fragment>
            {props.mode === 'edit' && <div style={{ justifyContent: 'space-between', padding: '5px 10px', backgroundColor: '#eee', display: 'flex', alignItems: 'center' }}>
              <div>
                <Icon type="arrow-up-line" />
                <Divider type="vertical" />
                <Icon type="arrow-down-line" />
              </div>
              <div>
                {mapping[view].subView && <Icon type="plus" onClick={() => props.addGroup({ parent_id: self.id, tree_id: self.tree_id, view: mapping[view].subView })} />}
                <Divider type="vertical" />
                <Icon type="edit" onClick={() => props.editGroup(self)} />
                <Divider type="vertical" />
                {/* <Popconfirm title="确定?" icon={<Icon type="warning" />} onConfirm={}> */}
                <Icon type="delete" onClick={() => props.destroyGroup(self)} />
                {/* </Popconfirm> */}
              </div>
            </div>}
            <Comp self={self} {...props}>{children}</Comp>
          </Fragment>)
      } else {
        return <div>----</div>
      }
    }
  } else {
    return <div>--</div>
  }
}