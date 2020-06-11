import _ from 'lodash'
import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Modal, Form, Input } from 'antd';

export default function SyncEditor({ data, cancel, save }) {
  const lb = { span: 3 }, rb = { span: 18 }
  const store = useLocalStore(() => ({
    data: data.id ? _.cloneDeep(data) : {},
    loading: false,
  }))
  store.data.condition = store.data.condition ? JSON.stringify(store.data.condition) : '{}'
  return <Observer>{() => (
    <Modal
      title={data.id ? '修改' : '添加'}
      visible={true}
      onOk={async () => {
        try {
          store.loading = true
          const success = await save(store.data)
          if (success) {
            cancel()
          }
        } catch (e) {

        } finally {
          store.loading = false
        }
      }}
      onCancel={() => {
        cancel()
      }}
    >
      <Form>
        <Form.Item label="名称" labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.name} autoFocus onChange={e => store.data.name = e.target.value} />
        </Form.Item>
        <Form.Item label="主键" labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.key} onChange={e => store.data.key = e.target.value} />
        </Form.Item>
        <Form.Item label="表名" labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.table} onChange={e => store.data.table = e.target.value} />
        </Form.Item>
        <Form.Item label="limit" labelCol={lb} wrapperCol={rb}>
          <Input type="number" defaultValue={10} value={store.data.limit} onChange={e => store.data.limit = e.target.value} />
        </Form.Item>
        <Form.Item label="上次更新" labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.updatedAt} onChange={e => store.data.updatedAt = e.target.value} />
        </Form.Item>
        <Form.Item label="条件" labelCol={lb} wrapperCol={rb}>
          <Input.TextArea value={store.data.condition} onChange={e => store.data.condition = e.target.value}></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  )}</Observer>
}
