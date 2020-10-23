import React, { useEffect, useCallback, useRef } from 'react';
import { Observer, useLocalStore, useComputed } from 'mobx-react-lite'
import apis from '../../../api';
import { useStore } from '../../../contexts'
import { Button, Switch, Modal, Form, Input, notification, Radio, Select, Card, Row, Col, Divider, message } from 'antd';
import { FullHeight, FullHeightFix, FullHeightAuto, CenterXY, AlignAside, Right, FullWidth, FullWidthFix, FullWidthAuto } from '../../../component/style'
import AutoView from '../../../Group/AutoView'
import { Mobile, Icon, VisualBox } from '../../../component'
import GroupAdd from './Edit'
import GroupEdit from './GroupEdit'
import ResourcesPick from './pickModal'

import models from '../../../models'
import storage from '../../../utils/storage'
import { Menu, Submenu, Item, Separator } from 'react-contexify';
import { CompImg } from './style'
import ImgPicker from '../../../images/picker2.svg'
import ImgFilter from '../../../images/filter2.svg'
import ImgGrid from '../../../images/menu2.svg'
import ImgTab from '../../../images/tab2.svg'
import ImgTabbar from '../../../images/tabbar2.svg'
import { GroupsDiff as diff, GroupsGetById as getById, createEmptyGroup } from '../../../utils/helper'

export default function GroupManagePage() {
  const store = useStore()
  const local = useLocalStore(() => ({
    createLoading: false,
    showGroupEdit: false,
    showGroupAdd: false,
    showPick: false,
    tree: null,
    temp: null,
    refreshing: false,
    submitting: false,
    tree_id: '',
    async refreshData() {
      const query = { v: 0 }
      const res = await apis.getGroupTrees({ query })
      store.groups = res.data.map(item => models.group.create(item))
    },
    get diff() {
      if (!this.tree) {
        return false;
      } else {
        return diff(this.tree);
      }
    },
  }))
  // 右键菜单事件
  const onEditGroup = ({ props }) => {
    store.app.setEditGroupId(props.id)
    local.temp = getById(local.tree, props.id);
    if (local.temp) local.showGroupEdit = true
  }
  const onDeleteGroup = ({ props }) => {
    const temp = getById(local.tree, props.id);
    if (temp) {
      if (temp.$new) {
        let tt = getById(local.tree, temp.parent_id);
        tt && tt.removeChild(temp.id)
      } else {
        temp.setKey('$delete', true)
      }
    }
  }
  const onAddChild = ({ props }) => {
    if (store.app.canAddChild(props.view)) {
      const p = getById(local.tree, props.id)
      local.temp = createEmptyGroup(p);
      local.showGroupAdd = true
    } else {
      message.warn('can not add child')
    }
  }
  const GroupMenu = (props) => (<Menu id='group_menu'>
    <Item onClick={e => onEditGroup(e, props)}>编辑</Item>
    <Item onClick={e => onDeleteGroup(e, props)}>删除</Item>
    <Item onClick={e => onAddChild(e, props)}>添加子视图</Item>
  </Menu>)
  const init = useCallback(async () => {
    local.refreshing = true
    await local.refreshData()
    local.tree_id = storage.getValue('choose_group_id')
    if (local.tree_id) {
      local.tree = store.groups.find(group => group.id === local.tree_id)
    }
    if (!local.tree && store.groups.length !== 0) {
      local.tree_id = store.groups[0].tree_id
      local.tree = store.groups[0]
    }
    local.refreshing = false
  })
  useEffect(() => {
    init()
  })
  return <Observer>{() => (
    <FullHeight>
      {/* 自定义右键菜单 */}
      <GroupMenu />
      <AlignAside style={{ margin: '0 15%' }}>
        {/* 顶部操作栏 */}
        <Select disabled={local.refreshing} style={{ width: 200, marginRight: 20 }} value={local.tree ? local.tree.title : ''} onChange={async (value) => {
          if (local.diff) {
            Modal.confirm({
              title: "confirm",
              content: "数据发生变化,确定要离开吗?",
              onOk() {
                local.tree.huifu()
                local.showGroupEdit = false;
                local.temp = null
                store.app.setEditGroupId('')
                local.tree_id = value
                storage.setValue('choose_group_id', local.tree_id)
                local.tree = store.groups.find(group => group.id === value)
              },
              onCancel() {

              },
            })
          } else {
            local.showGroupEdit = false;
            local.temp = null
            store.app.setEditGroupId('')
            local.tree_id = value
            storage.setValue('choose_group_id', local.tree_id)
            local.tree = store.groups.find(group => group.id === value)
          }
        }}>
          <Select.Option value={local.tree_id}>请选择</Select.Option>
          {store.groups.map((group, i) => (
            <Select.Option key={i} value={group.id}>{group.title}</Select.Option>
          ))}
        </Select>
        <Button.Group>
          <Button type="primary" disabled={local.tree === null || local.refreshing} onClick={() => {
            local.temp = local.tree
            local.showGroupEdit = true
          }}>编辑root</Button>
          <Button type="primary" onClick={() => {
            local.temp = createEmptyGroup()
            local.showGroupAdd = true
          }}>添加root</Button>
          <Button type="primary" onClick={async () => {
            await apis.destroyGroup(local.tree)
            local.tree = null
          }}>删除root</Button>
        </Button.Group>
        <Divider type="verticle" />
        <Button type="primary" loading={local.refreshing} onClick={async () => {
          init()
        }}>刷新数据</Button>
        <Divider type="verticle" />
        <Switch title="编辑" checked={store.app.groupMode === 'edit'} onChange={() => {
          if (store.app.groupMode === 'edit') {
            local.showGroupEdit = false
          } else {
          }
          store.app.toggleGroupMode()
        }} />
      </AlignAside>
      <FullWidth style={{ height: '100%', margin: '10px 0' }}>
        <FullWidthAuto style={{ height: '100%' }}>
          <FullHeight style={{ overflow: 'auto', alignItems: 'center' }}>
            <FullHeightFix>
              <div style={{ display: 'flex' }}>
                <CompImg src={ImgFilter} title="过滤组件" onDragStart={() => { store.app.setCurrentDragType('filter') }} />
                <CompImg src={ImgPicker} title="卡片组件" onDragStart={() => { store.app.setCurrentDragType('picker') }} />
                <CompImg src={ImgTab} title="tab组件" onDragStart={() => { store.app.setCurrentDragType('tab') }} />
                <CompImg src={ImgTabbar} title="tabbar组件" />
                <CompImg src={ImgGrid} title="grid组件" onDragStart={() => { store.app.setCurrentDragType('menu-grid') }} />
              </div>
            </FullHeightFix>
            <FullHeightAuto style={{ display: 'flex', alignItems: 'center' }}>
              <Mobile style={{ boxShadow: '#77b6e4 5px 5px 16px 7px', border: '1px solid #77b6e4' }}>
                {local.refreshing === false && local.tree && (
                  <AutoView
                    self={local.tree}
                    mode={store.app.groupMode}
                    tabIndex={store.app.groupMode === 'edit' ? 0 : ''}
                    mountGroup={group => {
                      local.temp = group
                      local.showGroupEdit = true
                    }}
                    addGroup={data => {
                      local.temp = data
                      local.showGroupAdd = true
                    }}
                    editGroup={data => {
                      local.temp = data
                      local.showGroupAdd = true
                    }}
                    addRef={data => {
                      local.temp = data
                      local.showPick = true
                    }}
                    destroyGroup={async data => {
                      if (store.app.currentEditGroupId === data.id) {
                        local.showGroupEdit = false;
                        local.temp = null;
                        store.app.setEditGroupId('')
                      }
                      await apis.destroyGroup(data)
                      init()
                    }}
                  // renderItem={item => (
                  //   // <BookItem item={item} />
                  //   <div>fuck</div>
                  // )}
                  />
                )}
              </Mobile>
            </FullHeightAuto>
            <FullHeightFix>
              <Button type="primary" disabled={!local.diff} loading={local.submitting} onClick={async () => {
                await apis.updateGroupTree(local.tree);
                init()
              }}>提交</Button>
            </FullHeightFix>
          </FullHeight>
        </FullWidthAuto>
        {local.showGroupEdit && <GroupEdit group={local.temp} openPick={() => {
          local.showPick = true
        }} onClose={() => { local.showGroupEdit = false; local.temp = null; store.app.setEditGroupId('') }} />}
      </FullWidth>
      {local.showGroupAdd && <GroupAdd
        data={local.temp}
        cancel={() => { local.temp = null; local.showGroupAdd = false }}
        save={async (data) => {
          data.params = JSON.parse(data.params)
          const curr = getById(local.tree, data.parent_id);
          if (curr) {
            curr.addChild(data)
          } else {
            await apis.createGroup(data)
            init()
          }
        }}
      />}
      {local.showPick && <ResourcesPick save={(data) => {
        local.temp.appendData(data);
      }} cancel={() => { local.showPick = false }} />}
      {/* <FullHeightFix>
        <Right style={{ margin: '0 15%' }}>
          <Button loading={local.addLoading} type="primary" disabled={local.refreshing || local.tree === null} onClick={async () => {
            local.temp = { parent_id: local.tree ? local.tree.id : '', tree_id: local.tree ? local.tree.id : '', view: 'picker' }
            local.showGroupEdit = true
          }}>添加视图</Button>
        </Right>
      </FullHeightFix> */}
    </FullHeight>
  )
  }</Observer >
}