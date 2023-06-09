import React from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, Switch, notification, Button, } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import store from '../../../store'
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'
import Edit from './edit'

const { Column } = Table;
const { createApp, updateApp, destroyApp } = apis

export default function AppList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    search_page: 1,
    count: 0,
    showEdit: false,
    temp: null,
  }))
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: 15 }}>
        <div style={{ flex: 1 }}>

        </div>
        <Right style={{ flex: 0, whiteSpace: 'nowrap' }}>
          <Button type="primary" onClick={e => {
            local.temp = { id: '', type: '', name: '', desc: '', url: '', enabled: true };
            local.showEdit = true
          }}>添加app</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto style={{ overflowY: 'hidden' }}>
        <Table
          className="box"
          dataSource={store.apps}
          rowKey="id"
          scroll={{ y: 'calc(100vh - 240px)' }}
          loading={local.isLoading}
          expandable={false}
          pagination={{
            pageSize: 200,
            current: local.search_page,
            total: local.count,
          }} onChange={(page) => {
            local.search_page = page.current
          }}>
          {/* <Column title="id" width={100} dataIndex="id" key="id" render={text => <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%' }}>{text}</span>} /> */}
          <Column title="名称" dataIndex="title" key="title" />
          <Column title="描述" dataIndex="desc" key="desc" />
          <Column title="状态" dataIndex="status" key="status" render={(text, record) => (
            <Switch checked={record.enabled} onClick={e => {
              apis.updateApp({ id: record.id, status: record.status ? 0 : 1 }).then(() => {
                record.status = !record.status
                notification.info({ message: '修改成功' })
              }).catch(e => {
                notification.info({ message: '修改失败' })
              })
            }} />
          )} />
          <Column title="操作" dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <FormOutlined onClick={() => { local.temp = record; local.showEdit = true }} />
              <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
                await destroyApp(record)
              }}>
                <DeleteOutlined />
              </Popconfirm>
            </div>
          )} />
        </Table>
      </FullHeightAuto>
      {local.showEdit && <Edit save={async (data) => {
        if (data.id) {
          await updateApp(data)
        } else {
          await createApp(data)
        }
      }} cancel={() => local.showEdit = false} data={local.temp} />}
    </FullHeight>
  )}</Observer>
}