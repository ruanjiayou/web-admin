import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, Switch, notification, Button } from 'antd';
import { DeleteOutlined, WarningOutlined, SyncOutlined, LoadingOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'

const { Column } = Table;
const { getTasks, updateTask, updateTaskResource, destroyTask } = apis

export default function TaskList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    resource_id: '',
    search_page: 1,
    count: 0,
    tasks: [],
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      resource_id: local.resource_id,
      page: local.search_page,
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
      <FullHeightFix style={{ padding: '20px 0' }}>
        <Right>
          <Button type="primary" onClick={e => { search() }}>刷新</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto>
        <Table className="box" dataSource={local.tasks} rowKey="resource_id" scroll={{ y: 600 }} loading={local.isLoading} pagination={{
          pageSize: 20,
          current: local.search_page,
          total: local.count,
        }} onChange={(page) => {
          local.search_page = page.current
          search()
        }}>
          <Column title="id" width={100} dataIndex="id" key="id" />
          <Column title="名称" width={100} dataIndex="name" key="name" />
          <Column title="origin" dataIndex="origin" key="origin" />
          <Column title="连载" width={100} dataIndex="status" key="status" render={(text, record) => (
            <Observer>{() => (
              <Switch checked={record.status === 'loading'} onClick={e => {
                updateTask({ rule_id: record.rule_id, resource_id: record.resource_id, status: record.status === 'loading' ? 'finished' : 'loading' }).then(() => {
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
              <SyncOutlined title="更新资源" onClick={() => {
                updateTaskResource({ rule_id: record.rule_id, origin: record.origin }).then(() => {
                  notification.info({ message: '操作成功' })
                });
              }} />
              <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
                await destroyTask(record)
                search()
              }}>
                <DeleteOutlined />
              </Popconfirm>
            </div>
          )} />
        </Table>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}