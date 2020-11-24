import React, { useRef } from 'react'
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
    title={local.data.id ? '修改链接' : '添加链接'}
    onCancel={e => { cancel() }}
    onOk={async () => {
      local.isLoading = true
      await save(local.data);
      cancel()
    }}
  >
    <Form>
      <Form.Item style={{ marginBottom: 5 }} label="名称" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="名称" value={local.data.name} onChange={e => local.data.name = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="类型" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="类型" value={local.data.type} onChange={e => local.data.type = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="enabled" labelCol={lb} wrapperCol={rb}>
        <Switch checked={local.data.enabled} onClick={e => {
          local.data.enabled = !local.data.enabled
        }} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="描述" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="描述" value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="地址" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="地址" value={local.data.url} onChange={e => local.data.url = e.target.value} />
      </Form.Item>
    </Form>
  </Modal>}</Observer>
}