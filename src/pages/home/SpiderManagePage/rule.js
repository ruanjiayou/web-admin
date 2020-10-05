import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, Modal, Form, Input, Card, Divider, notification, Table } from 'antd';
import { Icon } from '../../../component'
import apis from '../../../api';
import store from '../../../store'
import { FullHeight, FullHeightFix, FullHeightAuto } from '../../../component/style'

const { Column } = Table;
const { getRules, createRule, updateRule, addTask } = apis

export default function SpiderPage() {
  const lb = { span: 6, offset: 3 }, rb = { span: 12 }
  const urlRef = useRef(null)
  const originRef = useRef(null)
  const local = useLocalStore(() => ({
    isLoading: false,
    rule: {
      id: '',
      config: {},
      name: '',
      type: '',
    },
    rules: [],
    showEdit: false,
    inster: false,
    search_page: 1,
    count: 0,
  }))
  function openEdit(data) {
    if (data) {
      local.rule = data;
      local.inster = false
    } else {
      local.rule = {
        config: {}
      }
      local.inster = true
    }
    local.showEdit = true
  }
  const init = useCallback(async () => {
    local.rule = { config: {} };
    local.isLoading = true
    const result = await getRules({ page: local.search_page })
    local.isLoading = false
    local.rules = result.data
  }, [])
  useEffect(() => {
    init()
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: '20px 0', alignItems: 'flex-end' }}>
        <Button type="primary" onClick={e => { openEdit() }}>添加规则</Button>
      </FullHeightFix>
      <FullHeightAuto>
        <Table dataSource={local.rules} rowKey="id" scroll={{ y: 600 }} loading={local.isLoading} pagination={{
          pageSize: 20,
          current: local.search_page,
          total: local.count,
        }} onChange={(page) => {
          local.search_page = page.current
          init()
        }}>
          <Column title="规则id" dataIndex="id" key="id" render={(text) => (
            <a href={text} target="_blank">{text}</a>
          )} />
          <Column title="名称" dataIndex="name" key="name" />
          <Column title="类型" dataIndex="type" key="type" />
          <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <Icon type="page-search" onClick={() => {
                Modal.confirm({
                  title: '预览效果',
                  content: <Input ref={ref => originRef.current = ref} />,
                  okText: '预览',
                  cancelText: '取消',
                  onOk: () => {
                    if (originRef.current) {
                      if (record.type === 'pixiv') {
                        return window.open(`${store.app.baseUrl}/v1/admin/pixiv-preview?id=${originRef.current.state.value}`)
                      }
                      apis.previewTask({ origin: originRef.current.state.value, ruleId: record.id }).then(res => {
                        if (res.code === 0) {
                          notification.success({ message: 'success' })
                          console.log(res);
                        } else {
                          notification.error({ message: res.message })
                        }
                      })
                    } else {
                      notification.error({ message: 'ref fail' })
                    }
                  },
                  onCancel: () => {
                    originRef.current = null
                  }
                });
                setTimeout(() => {
                  if (originRef.current) {
                    originRef.current.focus()
                  }
                }, 100)
              }} />
              <Divider type="vertical" />
              <Icon type="edit" onClick={e => {
                openEdit(record)
              }} />
              <Divider type="vertical" />
              <Icon type="circle-plus" onClick={() => {
                Modal.confirm({
                  title: '添加任务',
                  content: <Input ref={ref => urlRef.current = ref} />,
                  onOk: () => {
                    if (urlRef.current) {
                      addTask(record, urlRef.current.state.value).then(res => {
                        if (res.code === 0) {
                          notification.success({ message: 'success' })
                        } else {
                          notification.error({ message: res.message })
                        }
                      })
                    } else {
                      notification.error({ message: 'ref fail' })
                    }
                  },
                  onCancel: () => {
                    urlRef.current = null
                  }
                })
                setTimeout(() => {
                  if (urlRef.current) {
                    urlRef.current.focus()
                  }
                }, 100)
              }} />
              <Divider type="vertical" />
              <Icon type="copy" />
              <Divider type="vertical" />
              <Icon type="delete" onClick={e => {
                alert('暂时不能删除')
              }} />
            </div>
          )} />
        </Table>
      </FullHeightAuto>
      {local.showEdit && (
        <Modal
          visible={true}
          style={{ overflow: 'auto', padding: 0 }}
          width={1000}
          title={local.inster ? '添加规则' : '修改规则'}
          onCancel={e => { local.inster = false; local.showEdit = false }}
          onOk={async () => {
            local.isLoading = true
            if (local.inster) {
              await createRule(local.rule)
            } else {
              await updateRule(local.rule)
            }
            await init()
            local.inster = false
            local.showEdit = false
          }}
        >
          <Form>
            <Form.Item label="域名-规则id" labelCol={lb} wrapperCol={rb}>
              <Input placeholder="http://www.biquge.com" value={local.rule.id} autoFocus onChange={e => local.rule.id = e.target.value} />
            </Form.Item>
            <Form.Item label="网站名称" labelCol={lb} wrapperCol={rb}>
              <Input placeholder="笔趣阁" value={local.rule.name} autoFocus onChange={e => local.rule.name = e.target.value} />
            </Form.Item>
            <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
              <Input placeholder="novel" value={local.rule.type} autoFocus onChange={e => local.rule.type = e.target.value} />
            </Form.Item>
            <Card title="config">
              <Form.Item label="章节标题$" labelCol={lb} wrapperCol={rb}>
                <Input placeholder="h1" value={local.rule.config.titleSelector} autoFocus onChange={e => local.rule.config.titleSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="章节内容$" labelCol={lb} wrapperCol={rb}>
                <Input placeholder="#content" value={local.rule.config.contentSelector} autoFocus onChange={e => local.rule.config.contentSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="书籍作者$" labelCol={lb} wrapperCol={rb}>
                <Input placeholder=".boot-title p" value={local.rule.config.authorSelector} autoFocus onChange={e => local.rule.config.authorSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="书籍封面$" labelCol={lb} wrapperCol={rb}>
                <Input placeholder=".book-img img" value={local.rule.config.posterSelector} autoFocus onChange={e => local.rule.config.posterSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="书籍简介$" labelCol={lb} wrapperCol={rb}>
                <Input placeholder=".book-intro" value={local.rule.config.introSelector} autoFocus onChange={e => local.rule.config.introSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="简介标签过滤$" labelCol={lb} wrapperCol={rb}>
                <Input placeholder="script span" value={local.rule.config.introFilterSelector} autoFocus onChange={e => local.rule.config.introFilterSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="书籍列表$" labelCol={lb} wrapperCol={rb}>
                <Input placeholder=".chapterlist a" value={local.rule.config.listSelector} autoFocus onChange={e => local.rule.config.listSelector = e.target.value} />
              </Form.Item>
            </Card>
          </Form>
        </Modal>
      )}
    </FullHeight>
  )}</Observer>
}