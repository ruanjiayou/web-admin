import _ from 'lodash'
import React, { useState, useRef } from 'react';
import { Button, Modal, Input, Form, Select, Radio, notification, Space, Switch, } from 'antd';
import { Icon } from '../../../component'
import { Observer, useLocalStore } from 'mobx-react-lite';
import CodeEditor from '../../../component/CodeEditor'

const Item = Form.Item;

export default function RuleEdit({ data, cancel, save }) {
  const local = useLocalStore(() => ({
    editORadd: data._id ? 'edit' : 'add',
    data: data._id ? _.cloneDeep(data) : {
      script: '',
      name: '',
      desc: '',
      status: 0
    },
    loading: false,
  }))
  const urlRef = useRef(null)
  return <Observer>{() => (<Modal
    width={750}
    title={local.editORadd === 'add' ? '添加' : "修改"}
    visible={true}
    okText={local.editORadd === 'add' ? '添加' : "修改"}
    cancelText="取消"
    onOk={async () => {
      local.loading = true
      await save(local.data);
      local.loading = false;
    }}
    onCancel={() => {
      cancel();
    }}>
    <Form>
      <Item label="标识:" labelCol={{ span: 4 }}>
        <Input disabled={local.editORadd === 'edit'} onChange={e => local.data._id = e.target.value} defaultValue={local.data._id} />
      </Item>
      <Item label="名称:" labelCol={{ span: 4 }}>
        <Input value={local.data.name} onChange={e => local.data.name = e.target.value} defaultValue={local.data.name} />
      </Item>
      <Item label="cron:" labelCol={{ span: 4 }} defaultValue={local.data.cron}>
        <Input value={local.data.cron} onChange={e => local.data.cron = e.target.value} defaultValue={local.data.cron} />
      </Item>
      <Item label="状态" labelCol={{ span: 4 }}>
        <Radio.Group name="status" defaultValue={local.data.status} onChange={e => {
          local.data.status = e.target.value;
        }}>
          <Radio value={0}>开发中</Radio>
          <Radio value={1}>手动</Radio>
          <Radio value={2}>自动</Radio>
          <Radio value={3}>禁用</Radio>
        </Radio.Group>
      </Item>
      <Item style={{ marginBottom: 0 }}>
        <CodeEditor style={{ height: 400 }} value={local.data.script} onChange={v => local.data.script = v} />
      </Item>
    </Form>
  </Modal>)}</Observer>;
}