import _ from 'lodash'
import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Modal, Radio, Form, Input, Select, } from 'antd';

export default function ChannelEditor({ data, cancel, save, groups }) {
  const lb = { span: 3 }, rb = { span: 18 }
  const store = useLocalStore(() => ({
    data: data.id ? _.cloneDeep(data) : {},
    loading: false,
    ref: '',
    maps: [],
  }))
  return <Observer>{() => (
    <Modal
      title={data.id ? '修改' : '添加'}
      visible={true}
      okText="确定"
      cancelText="取消"
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
        <Form.Item label="标题" labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.title} autoFocus onChange={e => store.data.title = e.target.value} />
        </Form.Item>
        <Form.Item label="描述" labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.desc} onChange={e => store.data.desc = e.target.value} />
        </Form.Item>
        <Form.Item label="序号" labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.order_index} type="number" onChange={e => store.data.order_index = e.target.value} />
        </Form.Item>
        <Form.Item label='开放' labelCol={lb} wrapperCol={rb}>
          <Radio.Group
            value={store.data.enable}
            options={[{ label: '显示', value: true }, { label: '隐藏', value: false }]}
            onChange={e => store.data.enable = e.target.value}
          />
        </Form.Item>
        <Form.Item label='group_id' labelCol={lb} wrapperCol={rb}>
          <Select value={store.data.group_id} onChange={value => store.data.group_id = value}>
            <Select.Option value="">无</Select.Option>
            {groups.map((m, index) => <Select.Option key={index} value={m.id}>{m.title}</Select.Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )}</Observer>
}
