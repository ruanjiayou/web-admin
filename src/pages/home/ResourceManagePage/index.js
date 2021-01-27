import React, { useEffect, useCallback } from 'react';
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api';
import ResourceList from './List'
import ResourceEdit from './Edit'
import { Button, Input, Select, Switch, Divider, Pagination, Modal, Form } from 'antd';
import store from '../../../store'

const { getResources, createResource, updateResource, destroyResource, getGroupTypes } = apis

async function destroy(data) {
  return await destroyResource(data)
}

async function save(data) {
  window.open(`${store.app.baseUrl}/v1/admin/book/${data.id}/store?token=${store.user.token}`, '_blank')
}

export default function ResourceManagePage() {
  const lb = { span: 3 }, rb = { span: 18 }
  const local = useLocalStore(() => ({
    isLoading: false,
    showEdit: false,
    showFastEdit: false,
    temp: null,
    count: 0,
    search_name: '',
    search_type: 'novel',
    search_page: 1,
    categories: {},
    resources: [],
  }))
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
  }, [])
  useEffectOnce(() => {
    getGroupTypes().then(result => {
      local.categories = result.data
      console.log(result, 'types')
    })
  }, [])
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
            search()
          }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="image">图片</Select.Option>
            <Select.Option value="animation">动漫</Select.Option>
            <Select.Option value="music">音频</Select.Option>
            <Select.Option value="video">视频</Select.Option>
            <Select.Option value="novel">小说</Select.Option>
            <Select.Option value="article">文章</Select.Option>
            <Select.Option value="news">资讯</Select.Option>
            <Select.Option value="private">私人</Select.Option>
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
            fastEdit={(data) => { local.temp = data; local.showFastEdit = true; }}
            destroy={async function (data) {
              await destroy(data)
              search()
            }}
            categories={local.categories}
            search={search}
            store={save}
            local={local}
          />
        </div>
      </div>
      {local.showEdit && <ResourceEdit data={local.temp} categories={local.categories[local.search_type] || []} cancel={() => { local.showEdit = false }} save={data => {
        if (data.id) {
          return updateResource(data)
        } else {
          return createResource(data)
        }
      }} />}
      {
        local.showFastEdit && (
          <Modal
            visible={true}
            onCancel={() => local.showFastEdit = false}
            okText={<Button type="primary" loading={local.isLoading}>确定</Button>}
            onOk={() => {

            }}
          >
            <Form>
              <Form.Item label="标题" labelCol={lb} wrapperCol={rb}>
                <Input value={local.temp.title} autoFocus onChange={e => local.temp.title = e.target.value} />
              </Form.Item>
              <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
                <Select value={local.temp.source_type || ''} onChange={value => {
                  local.temp.source_type = value
                  local.temp.type = ""
                }}>
                  {store.types.map(type => <Select.Option value={type.name} key={type.name}>{type.title}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item label="类别" labelCol={lb} wrapperCol={rb}>
                <Select value={local.temp.type} onChange={e => local.temp.type = e.target.value}>
                  <Select.Option value="">请选择</Select.Option>
                  {(local.categories[local.temp.type] || []).map(cata => (<Select.Option value={cata.name}>{cata.title}</Select.Option>))}
                </Select>
              </Form.Item>
              <Form.Item label="系列" labelCol={lb} wrapperCol={rb}>
                <Input value={local.temp.series} onChange={e => local.temp.series = e.target.value} />
              </Form.Item>
              <Form.Item label="公开" labelCol={lb} wrapperCol={rb}>
                <Switch checked={local.temp.open} onClick={e => {
                  local.temp.open = !local.temp.open
                }} /> {local.temp.open}
              </Form.Item>
              <Form.Item label="连载" labelCol={lb} wrapperCol={rb}>
                <Switch checked={local.temp.status === 'loading'} onClick={e => {
                  local.temp.status = local.temp.status === 'finished' ? 'finished' : 'loading'
                }} />
              </Form.Item>
            </Form>
          </Modal>
        )
      }
    </div>
  }}</Observer>)
}
