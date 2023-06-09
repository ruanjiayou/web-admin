import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Modal, Form, Input, Switch } from 'antd';

const lb = { span: 6, offset: 3 }, rb = { span: 12 }
export default function ({ data, save, cancel }) {
  const local = useLocalStore(() => ({
    data: data,
    isLoading: false,
  }))
  return <Observer>{() => <Modal
    visible={true}
    style={{ overflow: 'auto', padding: 0 }}
    width={600}
    title={local.data.id ? '修改应用' : '添加应用'}
    onCancel={e => { cancel() }}
    onOk={async () => {
      local.isLoading = true
      await save(local.data);
      cancel()
    }}
  >
    <Form>
      <Form.Item style={{ marginBottom: 5 }} label="名称" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="名称" value={local.data.title} onChange={e => local.data.title = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="状态" labelCol={lb} wrapperCol={rb}>
        <Switch checked={local.data.status} onClick={e => {
          local.data.status = local.data.status ? 0 : 1;
        }} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="描述" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="描述" value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
      </Form.Item>
    </Form>
  </Modal>}</Observer>
}