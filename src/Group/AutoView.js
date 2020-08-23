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
import { createGroupByType } from '../utils/helper'

function Root({ children }) {
  return children
}

// README: subView一般在父view处理视图.这里还列出来是编辑添加时要用于显示.
export const mapping = {
  "": {
    name: "root",
    component: Root,
  },
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
    onDrop: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (store.app.canTypeDrop(self.view)) {
        self.addChild(createGroupByType(self, store.app.currentDragType))
      }
      local.isDragOver = false;
      store.app.setCurrentDragType('');
    },
    onDragLeave: () => {
      local.isDragOver = false;
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!local.isDragOver && store.app.canTypeDrop(self.view)) {
        local.isDragOver = true;
      }
    }
  }))
  let view = mapping[self.view]
  let Comp = view ? view.component : null
  if (Comp) {
    return (
      <Observer>{() => (
        <Fragment>
          {(self.$delete === false || props.mode === 'edit') && (
            <EditWrap
              style={{ height: self.parent_id === "" ? "100%" : "" }}
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