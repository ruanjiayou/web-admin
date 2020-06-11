import React, { useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api';
import ResourceList from './List'
import ResourceEdit from './Edit'
import { Button, Input, Select, Divider, Pagination } from 'antd';

const { getResources, createResource, updateResource, destroyResource } = apis

async function destroy(data) {
  await destroyResource(data)
}

export default function ResourceManagePage() {
  const local = useLocalStore(() => ({
    isLoading: false,
    showEdit: false,
    temp: null,
    count: 0,
    search_name: '',
    search_type: 'novel',
    search_page: 1,
    categories: [],
    resources: [],
  }))
  let categories = []
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      search: local.search_name,
      source_type: local.search_type,
      page: local.search_page,
    }
    getResources(query).then(res => {
      local.isLoading = false
      local.count = res.count
      local.resources = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffect(() => {
    search()
  })
  return (<Observer>{() => {
    return <div className={'box'}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '10px 0' }}>
          名称<Divider type="vertical" />
          <Input style={{ width: 250 }} value={local.search_name} onChange={e => {
            local.search_name = e.target.value
          }} />
          <Divider type="vertical" />
          资源类型<Divider type="vertical" />
          <Select style={{ width: 150 }} value={local.search_type} onChange={value => {
            local.search_type = value
          }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="image">图片</Select.Option>
            <Select.Option value="animation">动漫</Select.Option>
            <Select.Option value="music">音频</Select.Option>
            <Select.Option value="video">视频</Select.Option>
            <Select.Option value="novel">小说</Select.Option>
            <Select.Option value="article">文章</Select.Option>
            <Select.Option value="news">资讯</Select.Option>
          </Select>
          <Divider type="vertical" />
          <Button type="primary" onClick={() => {
            search()
          }}>查询</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={() => { local.temp = {}; local.showEdit = true }}>添加资源</Button>
        </div>
        <div style={{ flex: '1 0 0%', overflow: 'auto' }}>
          <ResourceList
            items={local.resources}
            openEdit={(data) => { local.temp = data; local.showEdit = true; }}
            destroy={destroy}
            search={search}
            local={local}
          />
        </div>
      </div>
      {local.showEdit && <ResourceEdit data={local.temp} categories={categories} cancel={() => { local.showEdit = false }} save={data => {
        if (data.id) {
          return updateResource(data)
        } else {
          return createResource(data)
        }
      }} />}
    </div>
  }}</Observer>)
}
