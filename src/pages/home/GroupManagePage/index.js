import React, { useEffect, useCallback, useRef } from 'react';
import { Observer, useLocalStore, useComputed } from 'mobx-react-lite'
import apis from '../../../api';
import { useStore } from '../../../contexts'
import { Button, Switch, Form, Input, notification, Radio, Select, Card, Row, Col, Divider } from 'antd';
import { FullHeight, FullHeightFix, FullHeightAuto, CenterXY, AlignAside, Right, FullWidth, FullWidthFix, FullWidthAuto } from '../../../component/style'
import AutoView from '../../../Group/AutoView'
import { Mobile, Icon, VisualBox } from '../../../component'
import GroupAdd from './Edit'
import GroupEdit from './GroupEdit'
import models from '../../../models'
import storage from '../../../utils/storage'

function diff(group) {
  let diffed = group.diff()
  if (diffed) {
    return true
  } else {
    for (let i = 0; i < group.children.length; i++) {
      diffed = diff(group.children[i]);
      if (diffed) {
        return true;
      }
    }
  }
  return false
}

export default function GroupManagePage() {
  const store = useStore()
  const local = useLocalStore(() => ({
    createLoading: false,
    showGroupEdit: false,
    tree: null,
    temp: null,
    refreshing: false,
    submitting: false,
    tree_id: '',
    ts: Date.now(),
    config: null,
    async refreshData() {
      const res = await apis.getGroupTrees()
      store.groups = res.data.map(item => models.group.create(item))
    },
    get diff() {
      if (!this.config) {
        return false;
      } else {
        return diff(this.config);
      }
    },
    event: null,
    edited(e) {
      const tree_id = e.detail.tree_id;
      if (local.tree && tree_id === local.tree.tree_id) {
        local.ts = Date.now();
      }
    },
  }))
  const init = useCallback(async () => {
    local.refreshing = true
    await local.refreshData()
    local.tree_id = storage.getValue('choose_group_id')
    if (local.tree_id) {
      local.tree = store.groups.find(group => group.id === local.tree_id)
      // local.config = local.tree
    }
    if (!local.tree && store.groups.length !== 0) {
      local.tree_id = store.groups[0].tree_id
      local.tree = store.groups[0]
      // local.config = local.tree
    }
    local.refreshing = false
  })
  useEffect(() => {
    if (!local.event) {
      local.event = new Event('group')
      document.addEventListener('group', local.edited)
    }
    init()
  })
  return <Observer>{() => (
    <FullHeight>
      <AlignAside style={{ margin: '0 15%' }}>
        <Select disabled={local.refreshing} style={{ width: 200, marginRight: 20 }} value={local.tree ? local.tree.title : ''} onChange={async (value) => {
          local.tree_id = value
          local.tree = store.groups.find(group => group.id === value)
          local.config = local.tree
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
            local.temp = {}
            local.showGroupEdit = true
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
            local.config = null
          } else {
          }
          store.app.toggleGroupMode()
        }} />
      </AlignAside>
      <FullWidth style={{ height: '100%', margin: '10px 0' }}>
        <FullWidthAuto style={{ overflow: 'auto' }}>
          <CenterXY style={{ flexDirection: 'column' }}>
            <Mobile key={local.ts} style={{ boxShadow: '#77b6e4 5px 5px 16px 7px', border: '1px solid #77b6e4' }}>
              {local.refreshing === false && local.tree && (
                <AutoView
                  self={local.tree}
                  mode={store.app.groupMode}
                  tabIndex={store.app.groupMode === 'edit' ? 0 : ''}
                  mountGroup={group => {
                    local.config = group
                  }}
                  addGroup={data => {
                    local.temp = data
                    local.showGroupEdit = true
                  }}
                  editGroup={data => {
                    local.temp = data
                    local.showGroupEdit = true
                  }}
                  destroyGroup={async data => {
                    await apis.destroyGroup(data)
                    init()
                  }}
                  renderItem={item => (
                    // <BookItem item={item} />
                    <div>fuck</div>
                  )}
                />
              )}
            </Mobile>
            <Button type="primary" disabled={!local.diff} loading={local.submitting} onClick={() => {
              apis.updateGroupTree(local.config);
            }}>提交</Button>
          </CenterXY>
        </FullWidthAuto>
        {local.config ? <GroupEdit group={local.config} /> : <div></div>}
      </FullWidth>
      {local.showGroupEdit && <GroupAdd
        data={local.temp}
        cancel={() => { local.temp = null; local.showGroupEdit = false }}
        save={async (data) => {
          try {
            if (data.id) {
              await apis.updateGroup(data)
            } else {
              await apis.createGroup(data)
            }
            // storage.getValue('choose_group_id', null)
            // local.tree = null
            init()
            return true
          } catch (err) {
            return false
          }
        }}
      />}
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