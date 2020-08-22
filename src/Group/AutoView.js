import React, { Fragment, useEffect } from 'react'
import { Divider } from 'antd';
import { Observer, useLocalStore } from 'mobx-react-lite';
import { useStore } from '../contexts';
import Icon from '../component/Icon'
import Picker from './Picker'
import Filter from './Filter'
import FilterRow from './FilterRow'
import FilterTag from './FilterTag'
import Tree from './Tree'
import Tab from './Tab'
import TabPane from './TabPane'
import { CenterXY } from '../component/style'
import { VisualBox } from '../component';
import { EditWrap } from './style'

// README: subView一般在父view处理视图.这里还列出来是编辑添加时要用于显示.
export const mapping = {
  'picker': {
    name: '人工手选',
    component: Picker,
    leaf: true,
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
    component: FilterTag,
    leaf: true,
  },
  'tree-node': {
    name: '树节点',
    component: Tree,
    leaf: true,
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
export default function AutoView({ self, children = [], ...props }) {
  const store = useStore()
  const local = useLocalStore(() => ({
    isDragOver: false,
    onDrop: () => { local.isDragOver = false; console.log('drop' + self.id) },
    onDragLeave: () => { local.isDragOver = false; console.log('leave' + self.id) },
    onDragOver: (e) => { e.preventDefault(); local.isDragOver = true; console.log('enter' + self.id) }
  }))
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
      let view = mapping[self.view]
      let Comp = view ? view.component : null
      if (Comp) {
        return (
          <Observer>{() => (
            <Fragment>
              {/* {props.mode === 'edit' && self.$delete === false && <div style={{ justifyContent: 'space-between', padding: '5px 10px', backgroundColor: '#eee', display: 'flex', alignItems: 'center' }}>
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
                  <Popconfirm title="确定?" icon={<Icon type="warning" />} onConfirm={}>
                  <Icon type="delete" onClick={() => {
                    // props.destroyGroup(self)
                    self.setKey('$delete', true)
                  }} />
                  </Popconfirm>
                </div>
              </div>} */}
              {(self.$delete === false || props.mode === 'edit') && (
                <EditWrap
                  onDragOver={local.onDragOver}
                  onDragLeave={local.onDragLeave}
                  onDrop={local.onDrop}
                  className={`${props.mode} ${self.$delete ? 'delete' : ''} ${local.isDragOver ? 'dragover' : ''} ${store.app.currentEditGroupId === self.id ? 'focus' : ''}`}
                  tabIndex={props.mode === 'edit' ? 0 : ''}>
                  <Comp self={self} {...props}>
                    {
                      self.children.map(child => {
                        return <AutoView key={child.id} self={child} {...props}></AutoView>
                      })
                    }
                  </Comp>
                </EditWrap>
              )}
            </Fragment>
          )}</Observer>)
      } else {
        return null
      }
    }
  } else {
    return <div>--</div>
  }
}