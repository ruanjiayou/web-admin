import React, { useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api';
import ChannelList from './List'
import ChannelEdit from './Edit'
import { Button, Divider } from 'antd';
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'

const { createChannel, getChannels, updateChannel, updateChannels, destroyChannel } = apis

async function destroy(data) {
  await destroyChannel(data)
}

export default function ChannelManagePage() {
  const local = useLocalStore(() => ({
    isLoading: false,
    showEdit: false,
    temp: null,
    channels: [],
    sortChannels: (startIndex, endIndex) => {
      const data = local.channels[startIndex]
      const [removed] = local.channels.splice(startIndex, 1)
      local.channels.splice(endIndex, 0, data)
    }
  }))
  const sort = useCallback(async (startIndex, endIndex) => {
    local.sortChannels(startIndex, endIndex)
    let items = local.channels.map((it, index) => ({ where: { id: it.id }, data: { order_index: index + 1 } }))
    await updateChannels(items)
    let result = await getChannels()
    local.channels = result.data
  })
  const search = useCallback(() => {
    local.isLoading = true
    getChannels().then(res => {
      local.isLoading = false
      local.channels = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffect(() => {
    search()
  })
  return <Observer>{() => <FullHeight>
    <FullHeightFix>
      <Right style={{ padding: '10px 15%' }}>
        <Button type="primary" onClick={() => { local.temp = {}; local.showEdit = true }}>添加栏目</Button>
        <Divider type="vertical"/>
        <Button type="primary" onClick={() => { search() }}>刷新</Button>
      </Right>
    </FullHeightFix>
    <FullHeightAuto>
      <ChannelList
        items={local.channels}
        isLoading={local.isLoading}
        openEdit={(data) => { local.temp = data; local.showEdit = true; }}
        destroy={destroy}
        sort={sort}
      />
    </FullHeightAuto>
    {local.showEdit && <ChannelEdit groups={[]} data={local.temp} cancel={() => { local.showEdit = false }} save={async (data) => {
      let res = null
      if (data.id) {
        res = await updateChannel(data)
      } else {
        data.order_index = local.channels.length + 1
        res = await createChannel(data)
      }
      if (res && res.code === 0) {
        let result = await getChannels()
        local.channels = result.data
      }
      return res && res.code === 0
    }} />}
  </FullHeight>
  }</Observer >
}
