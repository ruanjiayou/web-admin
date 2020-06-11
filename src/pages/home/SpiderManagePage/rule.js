import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, Modal, Form, Input, Card, Divider, notification, Table } from 'antd';
import { DeleteOutlined, PlusCircleOutlined, CopyOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api';

const { Column } = Table;
const { getRules, createRule, updateRule, addTask } = apis

export default function SpiderPage() {
  const lb = { span: 6, offset: 3 }, rb = { span: 12 }
  const urlRef = useRef(null)
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
    <Fragment>
      <div className="box full-height" style={{ position: 'relative' }}>
        <div className="full-height-fix">
          <div style={{ padding: '20px 0', textAlign: 'right' }}>
            <Button type="primary" onClick={e => { openEdit() }}>添加规则</Button>
          </div>
        </div>
        <div className="full-height-auto">
          <Table dataSource={local.rules} rowKey="id" scroll={{ y: 600 }} loading={local.isLoading} pagination={{
            pageSize: 20,
            current: local.search_page,
            total: local.count,
          }} onChange={(page) => {
            local.search_page = page.current
            init()
          }}>
            <Column title="规则id" dataIndex="id" key="id" />
            <Column title="名称" dataIndex="name" key="name" />
            <Column title="类型" dataIndex="type" key="type" />
            <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => (
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <FormOutlined onClick={e => {
                  openEdit(record.toJSON())
                }} />
                <Divider type="vertical" />
                <PlusCircleOutlined onClick={() => {
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
                <CopyOutlined />
                <Divider type="vertical" />
                <DeleteOutlined onClick={e => {
                  alert('暂时不能删除')
                }} />
              </div>
            )} />
          </Table>
        </div>
      </div>
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
            <Form.Item label="规则id" labelCol={lb} wrapperCol={rb}>
              <Input value={local.rule.id} autoFocus onChange={e => local.rule.id = e.target.value} />
            </Form.Item>
            <Form.Item label="名称" labelCol={lb} wrapperCol={rb}>
              <Input value={local.rule.name} autoFocus onChange={e => local.rule.name = e.target.value} />
            </Form.Item>
            <Form.Item label="类型" labelCol={lb} wrapperCol={rb}>
              <Input value={local.rule.type} autoFocus onChange={e => local.rule.type = e.target.value} />
            </Form.Item>
            <Card title="config">
              <Form.Item label="titleSelector" labelCol={lb} wrapperCol={rb}>
                <Input value={local.rule.config.titleSelector} autoFocus onChange={e => local.rule.config.titleSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="authorSelector" labelCol={lb} wrapperCol={rb}>
                <Input value={local.rule.config.authorSelector} autoFocus onChange={e => local.rule.config.authorSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="posterSelector" labelCol={lb} wrapperCol={rb}>
                <Input value={local.rule.config.posterSelector} autoFocus onChange={e => local.rule.config.posterSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="introSelector" labelCol={lb} wrapperCol={rb}>
                <Input value={local.rule.config.introSelector} autoFocus onChange={e => local.rule.config.introSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="listSelector" labelCol={lb} wrapperCol={rb}>
                <Input value={local.rule.config.listSelector} autoFocus onChange={e => local.rule.config.listSelector = e.target.value} />
              </Form.Item>
              <Form.Item label="contentSelector" labelCol={lb} wrapperCol={rb}>
                <Input value={local.rule.config.contentSelector} autoFocus onChange={e => local.rule.config.contentSelector = e.target.value} />
              </Form.Item>
            </Card>
          </Form>
        </Modal>
      )}
    </Fragment>

  )}</Observer>
}