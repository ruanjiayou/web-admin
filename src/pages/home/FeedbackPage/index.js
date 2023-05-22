import React, { useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, Button, Divider, DatePicker, Input, Select, } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, FullWidthFix } from '../../../component/style'
import { useEffectOnce } from 'react-use';

const { Column } = Table;
const { getFeedbacks, createFeedback, updateFeedback, destroyFeedback } = apis

export default function FeedbackPage() {
  const local = useLocalStore(() => ({
    isLoading: false,
    count: 0,
    items: [],
    showEdit: false,
    temp: null,
    query: {
      status: '',
      title: '',
      id: '',
      page: 1,
    }
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      page: local.query.page,
      resource_title: local.query.title,
      resource_id: local.query.id,
      status: local.query.status
    }
    getFeedbacks(query).then(res => {
      local.isLoading = false
      local.count = res.count
      local.items = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffectOnce(() => {
    search()
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: 15, justifyContent: 'space-between' }}>
        <div>
          <Input addonBefore='名称' style={{ width: 150 }} value={local.query.title} onChange={e => {
            local.query.title = e.target.value
          }} />
          <Divider type="vertical" />
          <Input addonBefore='id' style={{ width: 150 }} value={local.query.id} onChange={e => {
            local.query.id = e.target.value
          }} />
          <Divider type="vertical" />
          <Select style={{ width: 100 }} value={local.query.status} onChange={value => {
            local.query.status = value
          }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="1">待处理</Select.Option>
            <Select.Option value="2">处理中</Select.Option>
            <Select.Option value="3">已处理</Select.Option>
          </Select>
        </div>
        <div>
          <Button type="primary" onClick={e => { search(); }}>查询</Button>
        </div>
      </FullHeightFix>
      <FullHeightAuto style={{ overflowY: 'hidden' }}>
        <Table className="box" dataSource={local.items} rowKey="id" scroll={{ y: 'calc(100vh - 250px)' }} loading={local.isLoading} pagination={null} onChange={(page) => {
          local.search_page = page.current
          search()
        }}>
          <Column title="资源id" width={100} dataIndex="resource_id" key="resource_id" />
          <Column title="资源名称" width={100} dataIndex="resource_title" key="resource_title" />
          <Column title="创建日期" width={100} dataIndex="created_at" key="created_at" />
          <Column title="状态" width={120} dataIndex="status" key="status" render={(text, record) => <Select value={record.status}>
            <Select.Option value={1}>待处理</Select.Option>
            <Select.Option value={2}>处理中</Select.Option>
            <Select.Option value={3}>已处理</Select.Option>
          </Select>
          } />
          <Column title="内容" width={80} dataIndex="content" key="content" />
        </Table>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}