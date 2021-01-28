import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, Switch, notification, Button, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined, SyncOutlined, LoadingOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'
import Edit from './edit'
import { useEffectOnce } from 'react-use';

const { Column } = Table;
const { getLinks, createLink, updateLink, destroyLink } = apis

export default function TaskList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    search_page: 1,
    count: 0,
    links: [],
    showEdit: false,
    temp: null,
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      page: local.search_page,
    }
    getLinks(query).then(res => {
      local.isLoading = false
      local.links = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffectOnce(() => {
    search()
  });
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: 15 }}>
        <div style={{ flex: 1 }}>

        </div>
        <Right style={{ flex: 0, whiteSpace: 'nowrap' }}>
          <Button type="primary" onClick={e => {
            local.temp = { id: '', type: '', name: '', desc: '', url: '', enabled: true };
            local.showEdit = true
          }}>添加链接</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={search}>刷新</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto style={{ overflowY: 'hidden' }}>
        <Table
          className="box"
          dataSource={local.links}
          rowKey="id"
          scroll={{ y: 'calc(100vh - 240px)' }}
          loading={local.isLoading}
          pagination={{
            pageSize: 200,
            current: local.search_page,
            total: local.count,
          }} onChange={(page) => {
            local.search_page = page.current
            search()
          }}>
          {/* <Column title="id" width={100} dataIndex="id" key="id" render={text => <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%' }}>{text}</span>} /> */}
          <Column title="名称" dataIndex="name" key="name" />
          <Column title="类型" dataIndex="type" key="type" />
          <Column title="地址" dataIndex="url" key="url" render={text => {
            return <a href={text} target="_blank">{text}</a>
          }} />
          <Column title="描述" dataIndex="desc" key="desc" />
          <Column title="enabled" dataIndex="enabled" key="enabled" render={(text, record) => (
            <Switch checked={record.enabled} onClick={e => {
              apis.updateLink({ id: record.id, enabled: !record.enabled }).then(() => {
                record.enabled = !record.enabled
                search()
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
                await destroyLink(record)
                search()
              }}>
                <DeleteOutlined />
              </Popconfirm>
            </div>
          )} />
        </Table>
      </FullHeightAuto>
      {local.showEdit && <Edit save={async (data) => {
        if (data.id) {
          await updateLink(data)
        } else {
          await createLink(data)
        }
        search()
      }} cancel={() => local.showEdit = false} data={local.temp} />}
    </FullHeight>
  )}</Observer>
}