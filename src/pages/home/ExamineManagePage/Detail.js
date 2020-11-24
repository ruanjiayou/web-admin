import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { Table, Popconfirm, Switch, notification, Button, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'
import Edit from './QuestionEdit'
import { useEffectOnce } from 'react-use';
import store from '../../../store';
import { useRouter } from '../../../contexts/router'

const { Column } = Table;
const { getQuestions, createQuestion, updateQuestion, destroyQuestion } = apis
const typeMap = {
  'radio': '单选',
  'multi': '多选',
  'simple': '简答',
  'boolean': '判断',
}
export default function QuestionList() {
  const router = useRouter()
  const local = useLocalStore(() => ({
    isLoading: false,
    search_page: 1,
    examId: router.getQuery().id,
    count: 0,
    examine: null,
    questions: [],
    showEdit: false,
    temp: null,
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      page: local.search_page,
      detail: 1,
    }
    const params = {
      examId: local.examId,
    }
    getQuestions({ query, params }).then(res => {
      local.isLoading = false
      local.count = res.count
      local.examine = res.examine
      local.questions = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffectOnce(() => {
    search()
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: '20px 0' }}>
        <div style={{ flex: 1 }}>

        </div>
        <Right style={{ flex: 0, whiteSpace: 'nowrap' }}>
          <Button type="primary" onClick={e => {
            local.temp = {
              type: 'radio', title: '', desc: '', image: '', groupId: '',
              examId: local.examId,
            }; local.showEdit = true
          }}>添加question</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={e => { search() }}>刷新</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto style={{ overflowY: 'hidden' }}>
        <Table className="box"
          dataSource={local.questions}
          rowKey="id"
          scroll={{ y: 400 }}
          loading={local.isLoading}
          pagination={{
            pageSize: 200,
            current: local.search_page,
            total: local.count,
          }} onChange={(page) => {
            local.search_page = page.current
            search()
          }}>
          <Column title="名称" width={100} dataIndex="title" key="title" />
          <Column title="图片" width={80} dataIndex="image" key="image" render={pathname => {
            return pathname ? <img style={{ maxWidth: 100, maxHeight: 80 }} src={store.app.imageLine + pathname} /> : '无'
          }} />
          <Column title="类型" width={80} dataIndex="type" key="type" render={txt => typeMap[txt]} />
          <Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <FormOutlined style={{ marginRight: 10 }} onClick={() => { local.temp = record; local.showEdit = true }} />
              <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
                await destroyQuestion({ examId: local.examId, id: record.id })
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
        if (data.id) {
          await updateQuestion({ params: { examId: local.examId, id: data.id }, data })
        } else {
          await createQuestion(data)
        }
        search()
      }} cancel={() => local.showEdit = false} examine={local.examine} data={local.temp} />}
    </FullHeight>
  )}</Observer>
}