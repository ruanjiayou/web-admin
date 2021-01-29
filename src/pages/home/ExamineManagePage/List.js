import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { Table, Popconfirm, Switch, notification, Button, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, padding } from '../../../component/style'
import Edit from './edit'
import { useEffectOnce } from 'react-use';
import { updateExamine } from '../../../api/examine';
import store from '../../../store';
import { Link } from 'react-router-dom';

const { Column } = Table;
const { getExamines, createExamine, destroyExamine } = apis

export default function ExamineList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    search_page: 1,
    count: 0,
    examines: [],
    showEdit: false,
    temp: null,
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      page: local.search_page,
    }
    getExamines(query).then(res => {
      local.isLoading = false
      local.count = res.count
      local.examines = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffectOnce(() => {
    search()
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={padding}>
        <div style={{ flex: 1 }}>

        </div>
        <Right style={{ flex: 0, whiteSpace: 'nowrap' }}>
          <Button type="primary" onClick={e => {
            local.temp = {
              type: 1, title: '', desc: '', image: ''
            }; local.showEdit = true
          }}>添加考卷</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={e => { search() }}>刷新</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto style={{ overflowY: 'hidden' }}>
        <Table className="box"
          dataSource={local.examines}
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
          <Column title="名称" width={100} dataIndex="title" key="title" render={(txt, record) => <Link to={'/admin/home/examine-manage/detail?id=' + record.id} >{txt}</Link>} />
          <Column title="图片" width={80} dataIndex="image" key="image" render={pathname => {
            return pathname ? <img style={{ maxWidth: 100, maxHeight: 80 }} src={store.app.imageLine + pathname} /> : '无'
          }} />
          <Column title="题目数量" width={80} dataIndex="amount" key="amount" />
          <Column title="状态" width={100} dataIndex="status" key="status" render={text => {
            return text === 1 ? '未开始' : (text === 2 ? '未使用' : '使用中')
          }} />
          <Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <FormOutlined onClick={() => { local.temp = record; local.showEdit = true }} />
              <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
                await destroyExamine(record.id)
                search()
              }}>
                <DeleteOutlined />
              </Popconfirm>
            </div>
          )} />
        </Table>
      </FullHeightAuto>
      {local.showEdit && <Edit save={async (data) => {
        data = toJS(data)
        console.log(data)
        if (data.id) {
          await updateExamine({ params: { id: data.id }, data })
        } else {
          await createExamine(data)
        }
        search()
      }} cancel={() => local.showEdit = false} data={local.temp} />}
    </FullHeight>
  )}</Observer>
}