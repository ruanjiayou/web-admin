import React, { useCallback, } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, Switch, notification, Button, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'
import { useEffectOnce } from 'react-use';
import Edit from './edit'
import store from '../../../store'

const { Column } = Table;

export default function UserManagePage() {
  const local = useLocalStore(() => ({
    isLoading: false,
    search_page: 1,
    count: 0,
    users: [],
    showEdit: false,
    temp: null,
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      page: local.search_page,
    }
    apis.getUsers(query).then(res => {
      local.isLoading = false
      local.users = res.data
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
            local.temp = { _id: '', nickname: '', account: '', avatar: '', salt: '', password: '', spider_id: '', source_id: '' };
            local.showEdit = true
          }}>添加用户</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={search}>刷新</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto style={{ overflowY: 'hidden' }}>
        <Table
          className="box"
          dataSource={local.users}
          rowKey="_id"
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
          <Column title="id" width={100} dataIndex="_id" key="_id" render={text => <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%' }}>{text}</span>} />
          <Column title="头像" dataIndex="avatar" key="avatar" render={avatar => (
            avatar ? <img src={store.app.imageLine + avatar} style={{ width: 50 }} /> : null
          )} />
          <Column title="昵称" dataIndex="nickname" key="nickname" render={text => {
            return <a href={text} target="_blank">{text}</a>
          }} />
          <Column title="账号" dataIndex="account" key="account" />
          <Column title="规则" dataIndex="spider_id" key="spider_id" />
          <Column title="源id" dataIndex="source_id" key="source_id" />
          <Column title="操作" dataIndex="_id" key="_id" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <FormOutlined onClick={() => { local.temp = record; local.showEdit = true }} />
              <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
                await apis.destroyUser(record)
                search()
              }}>
                <DeleteOutlined />
              </Popconfirm>
            </div>
          )} />
        </Table>
        {local.showEdit && <Edit save={async (data) => {
          if (data._id) {
            await apis.updateUser(data)
          } else {
            await apis.createUser(data)
          }
          search()
        }} cancel={() => local.showEdit = false} data={local.temp} />}
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}