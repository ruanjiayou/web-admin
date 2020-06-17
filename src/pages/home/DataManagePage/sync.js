import React, { useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined, UploadOutlined, CloudDownloadOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import EditorPage from './sync-edit'
import VisualBox from '../../../component/VisualBox'
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'

const { getSyncs, createSync, destroySync, updateSync, updateSyncProd, updateSyncDev } = apis
const { Column } = Table;

function editSync(data, local, search) {
  const api = data.id ? updateSync : createSync
  local.isFetching = true
  api(data).then(res => {
    local.isFetching = false
    if (res.code === 0) {
      local.showEditorPage = false
      local.temp = null
      notification.success({ 'message': '操作成功' })
      search()
    } else {
      notification.error({ 'message': '操作失败' })
    }
  })
}

export default function SyncListPage() {
  const local = useLocalStore(() => ({
    isLoading: false,
    isFetching: false,
    showEditorPage: false,
    temp: null,
    syncs: [],
  }))
  const search = useCallback(() => {
    local.isLoading = true
    getSyncs().then(res => {
      local.isLoading = false
      local.syncs = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffect(() => {
    if (local.syncs.length === 0) {
      search()
    }
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: '20px 0' }}>
        <Right>
          <Button type="primary" onClick={e => {
            local.temp = {}
            local.showEditorPage = true
          }}>添加同步规则</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={() => search()}>刷新数据</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto>
        <Table dataSource={local.syncs} rowKey="id" scroll={{ y: 600 }} loading={local.isLoading} pagination={false}>
          <Column title="名称" width={100} dataIndex="name" key="name" />
          <Column title="id" width={150} dataIndex="id" key="id" render={text => <span style={{ width: 100, overflow: 'hidden', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</span>} />
          <Column title="主键" width={100} dataIndex="key" key="key" />
          <Column title="表名" width={100} dataIndex="table" key="table" />
          <Column title="数量" width={50} dataIndex="limit" key="limit" />
          <Column title="上次更新" dataIndex="updatedAt" key="updatedAt" render={(text, record) => {
            return <span>{new Date(record.updatedAt).toLocaleString()}</span>
          }} />
          <Column title="条件" dataIndex="condition" key="condition" render={(text, record) => (
            <span>{JSON.stringify(record.condition, null, 2)}</span>
          )}
          />
          <Column title="操作" width={150} dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <VisualBox visible={process.env.NODE_ENV === 'development'}>
                <Popconfirm title="确定?" icon={<WarningOutlined />} onConfirm={() => { updateSyncProd(record) }}>
                  <UploadOutlined />
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm title="确定?" icon={<WarningOutlined />} onConfirm={() => { updateSyncDev(record) }}>
                  <CloudDownloadOutlined />
                </Popconfirm>
                <Divider type="vertical" />
              </VisualBox>
              <FormOutlined onClick={() => {
                local.temp = record
                local.showEditorPage = true
              }} />
              <Divider type="vertical" />
              <Popconfirm title="确定?" icon={<WarningOutlined />} onConfirm={() => { destroySync(record) }}>
                <DeleteOutlined />
              </Popconfirm>
            </div>
          )} />
        </Table>
      </FullHeightAuto>
      {local.showEditorPage && <EditorPage save={data => {
        editSync(data, local, search)
      }} cancel={() => {
        local.showEditorPage = false
        local.temp = null
      }} data={local.temp} />}
    </FullHeight>
  )}</Observer>
}