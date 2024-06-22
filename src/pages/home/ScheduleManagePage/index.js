import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api';
import { Button, Table, Popconfirm, Divider, notification } from 'antd';
import { RedoOutlined, WarningOutlined, PoweroffOutlined, PlayCircleOutlined, EditOutlined } from '@ant-design/icons'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, padding } from '../../../component/style'
import Editor from './edit';
import { toJS } from 'mobx';

const { Column } = Table;
const { getSchedules, tickSchedule, switchSchedule, updateSchedule, createSchedule } = apis

export default function ResourceManagePage() {
  const local = useLocalStore(() => ({
    isLoading: false,
    count: 0,
    schedules: [],
    temp: null,
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
  const toggle = useCallback(async (record) => {
    local.isLoading = true
    await switchSchedule(record._id, record.status === 1 ? 2 : 1)
    await refresh();
    local.isLoading = false
  })
  useEffect(() => {
    refresh()
  })
  return (<Observer>{() => (
    <FullHeight>
      <FullHeightFix>
        <Right style={padding}>
          <Button type="primary" onClick={() => {
            refresh()
          }}>刷新</Button>
        </Right>
      </FullHeightFix>
      {local.temp && <Editor cancel={() => local.temp = null} data={local.temp} save={async (data) => {
        const result = local.temp._id ? await updateSchedule(local.temp._id, data) : await createSchedule(data)
        if (result.code === 0) {
          await refresh()
          notification.info({ message: '保存成功' });
          local.temp = null;
        } else {
          notification.warning({ message: result.message })
        }
      }} />}
      <FullHeightAuto>
        <Table pagination={false} dataSource={toJS(local.schedules)} rowKey="name" scroll={{ y: 600 }} loading={local.isLoading}>
          <Column title="名称" dataIndex="name" key="name" />
          <Column title="活动状态" dataIndex="isRuning" key="isRuning" render={(text, record) => (
            <span>{record.isRuning ? '进行中' : '已停止'}</span>
          )} />
          <Column title="开启状态" dataIndex="isActive" key="name" render={(text, record) => (
            <span>
              {record.status === 1 && '手动'}
              {record.status === 2 && '自动'}
              {record.status === 3 && '禁用'}
              {record.status === 0 && '开发中'}
            </span>
          )} />
          <Column title="cron" dataIndex="cron" key="name" />
          <Column title="操作" width={100} dataIndex="action" key="name" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <EditOutlined onClick={() => {
                local.temp = record;
              }} />
              <Divider type='vertical' />
              {record.isActive && (
                <Fragment>
                  {record.status === 2 ? <PoweroffOutlined onClick={() => toggle(record)} /> : <PlayCircleOutlined onClick={() => toggle(record)} />}
                  <Divider type='vertical' />
                  <Popconfirm title="确定?" disabled={record.isRuning} icon={<WarningOutlined />} onConfirm={() => { tickSchedule(record) }}>
                    <RedoOutlined />
                  </Popconfirm>
                </Fragment>
              )}
            </div>
          )} />
        </Table>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>)
}
