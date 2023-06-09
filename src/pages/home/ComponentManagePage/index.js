import React, { useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useEffectOnce } from 'react-use';
import apis from '../../../api';
import List from './List'
import Editor from './Edit'
import { Button, Divider } from 'antd';
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'
import { useStore } from '../../../contexts'

const { createComponent, getComponents, updateComponent, updateComponents, destroyComponent } = apis

async function destroy(data) {
  await destroyComponent(data)
}

export default function ComponentManagePage() {
  const store = useStore()
  const local = useLocalStore(() => ({
    isLoading: false,
    showEdit: false,
    temp: null,
    sortComponents: (startIndex, endIndex) => {
      const data = store.components[startIndex]
      store.components.splice(startIndex, 1)
      store.components.splice(endIndex, 0, data)
    }
  }))
  const sort = useCallback(async (startIndex, endIndex) => {
    local.sortComponents(startIndex, endIndex)
    let items = store.components.map((it, index) => ({ where: { id: it.id }, data: { order_index: index + 1 } }))
    await updateComponents(items)
    let result = await getComponents()
    store.components = result.data
  })
  const search = useCallback(() => {
    local.isLoading = true
    getComponents().then(res => {
      local.isLoading = false
      store.components = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])

  useEffectOnce(() => {
    if (store.groups.length === 0) {
      apis.getGroupTrees({ query: { v: 0 } }).then(res => {
        store.groups = res.data
      })
    }
  })
  return <Observer>{() => <FullHeight>
    <FullHeightFix>
      <Right style={{ padding: '10px 15%' }}>
        <Button type="primary" onClick={() => { local.temp = {}; local.showEdit = true }}>添加组件</Button>
        <Divider type="vertical" />
        <Button type="primary" onClick={() => { search() }}>刷新</Button>
      </Right>
    </FullHeightFix>
    <FullHeightAuto>
      <List
        items={store.components}
        isLoading={local.isLoading}
        openEdit={(data) => { local.temp = data; local.showEdit = true; }}
        destroy={destroy}
        sort={sort}
      />
    </FullHeightAuto>
    {local.showEdit && <Editor data={local.temp} cancel={() => { local.showEdit = false }} save={async (data) => {
      let res = null
      if (data.id) {
        res = await updateComponent(data)
      } else {
        data.order_index = store.components.length + 1
        res = await createComponent(data)
      }
      if (res && res.code === 0) {
        let result = await getComponents()
        store.components = result.data
      }
      return res && res.code === 0
    }} />}
  </FullHeight>
  }</Observer >
}
