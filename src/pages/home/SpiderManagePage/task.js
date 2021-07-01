import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, Switch, notification, Button, Divider, Select, Input } from 'antd';
import { DeleteOutlined, WarningOutlined, SyncOutlined, LoadingOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, FullWidth } from '../../../component/style'
import { Icon } from '../../../component';
import Clipboard from 'react-clipboard.js';

const { Column } = Table;
const { getTasks, updateTask, updateTaskResource, destroyTask } = apis

export default function TaskList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    resource_id: '',
    search_page: 1,
    status: 'loading',
    type: '',
    count: 0,
    tasks: [],
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      resource_id: local.resource_id,
      page: local.search_page,
      status: local.status,
      type: local.type,
    }
    getTasks(query).then(res => {
      local.isLoading = false
      local.count = res.count
      local.tasks = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffect(() => {
    search()
  })
  return <Observer>{() => (
    <FullHeight>
      <FullWidth style={{ padding: 15 }}>
        类型:
        <Select defaultValue={local.type} onChange={txt => {
          local.type = txt
          search()
        }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="novel">小说</Select.Option>
          <Select.Option value="image">图片</Select.Option>
          <Select.Option value="video">视频</Select.Option>
        </Select>
        <Divider type="vertical" />
        状态:
        <Select defaultValue={local.status} onChange={txt => {
          local.status = txt
          search()
        }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="init">init</Select.Option>
          <Select.Option value="loading">loading</Select.Option>
          <Select.Option value="fail">失败</Select.Option>
          <Select.Option value="finished">成功</Select.Option>
        </Select>
        <Divider type="vertical" />
        <Input style={{ width: 200 }} placeholder="根据资源id搜索" />
        <Divider type="vertical" />
        <Button type="primary" onClick={e => { search() }}>刷新</Button>
      </FullWidth>
      <FullHeightAuto>
        <Table className="box" scroll={{ y: 'calc(100vh - 250px)' }} dataSource={local.tasks} rowKey="resource_id" loading={local.isLoading} pagination={{
          pageSize: 20,
          current: local.search_page,
          total: local.count,
        }} onChange={(page) => {
          local.search_page = page.current
          search()
        }}>
          <Column title="名称" width={100} dataIndex="name" key="name" />
          <Column title="origin" dataIndex="origin" key="origin" render={text => {
            return <a href={text} target="_blank">{text}</a>
          }} />
          <Column title="连载" width={100} dataIndex="status" key="status" render={(text, record) => (
            <Observer>{() => (
              <Switch disabled={record.status === 'finished'} checked={record.status === 'loading'} onClick={e => {
                updateTask({ id: record.id, status: record.status === 'loading' ? 'finished' : 'loading' }).then(() => {
                  record.status = record.status === 'loading' ? 'finished' : 'loading'
                  notification.info({ message: '修改成功' })
                }).catch(e => {
                  console.log(e)
                  notification.info({ message: '修改失败' })
                })
              }} />
            )}
            </Observer>
          )} />
          <Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <Icon type="copy" title={record.id} />
              <Divider type="vertical" />
              <SyncOutlined title="更新资源" onClick={() => {
                updateTaskResource(record).then(() => {
                  notification.info({ message: '操作成功' })
                });
              }} />
              <Divider type="vertical" />
            </div>
          )} />
        </Table>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}