import React, { useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api';
import { Button, Divider, Table, Popconfirm, Switch } from 'antd';
import { RedoOutlined, WarningOutlined, PoweroffOutlined, PlayCircleOutlined } from '@ant-design/icons'

const { Column } = Table;
const { getSchedules, tickSchedule, switchSchedule } = apis

export default function ResourceManagePage() {
  const local = useLocalStore(() => ({
    isLoading: false,
    count: 0,
    schedules: [],
  }))
  const refresh = useCallback(() => {
    local.isLoading = true
    getSchedules().then(res => {
      local.isLoading = false
      local.schedules = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffect(() => {
    refresh()
  })
  return (<Observer>{() => {
    return <div className={'box'}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '10px 0' }}>
          <Button type="primary" onClick={() => {
            refresh()
          }}>刷新</Button>
          <Divider type="vertical" />
        </div>
        <div style={{ flex: '1 0 0%', overflow: 'auto' }}>
          <Table dataSource={local.schedules} rowKey="id" scroll={{ y: 600 }} loading={local.isLoading}>
            <Column title="名称" dataIndex="name" key="name" />
            <Column title="状态" dataIndex="state" key="state" render={(text, record) => (
              <Switch checked={record.state === 1} />
            )} />
            <Column title="cron" dataIndex="cron" key="cron" />
            <Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {record.state === 1 ? <PoweroffOutlined onClick={() => switchSchedule(record)} /> : <PlayCircleOutlined onClick={() => switchSchedule(record)} />}
                <Popconfirm title="确定?" icon={<WarningOutlined />} onConfirm={() => { tickSchedule(record) }}>
                  <RedoOutlined />
                </Popconfirm>
              </div>
            )} />
          </Table>
        </div>
      </div>
    </div>
  }}</Observer>)
}
