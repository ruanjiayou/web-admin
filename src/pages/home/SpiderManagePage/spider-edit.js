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
    data: data._id ? _.cloneDeep(data) : { config: { proxy: 0, from: 'url' }, urls: [], pattern: '', script: '', name: '', desc: '', header: {}, status: 0 },
    loading: false,
    ref: '',
    poster: data.poster || '',
    maps: [],
    tagAddVisible: false,
    typeAddVisible: false,
    urlAddVisible: false,
    tempTag: '',
    tempType: '',
    tempUrl: '',
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
        <Input value={local.data.name} autoFocus onChange={e => local.data.name = e.target.value} defaultValue={local.data.name} />
      </Item>
      <Item label="描述:" labelCol={{ span: 4 }} defaultValue={local.data.desc}>
        <Input.TextArea />
      </Item>
      <Item label="代理" labelCol={{ span: 4 }}>
        <Radio.Group name="proxy" defaultValue={local.data.config.proxy} onChange={e => local.data.config.proxy = e.target.value}>
          <Radio value={0}>无</Radio>
          <Radio value={1}>有</Radio>
        </Radio.Group>
      </Item>
      <Item label="from" labelCol={{ span: 4 }}>
        <Radio.Group name="from" defaultValue={local.data.config.from} onChange={e => {
          local.data.config.from = e.target.value;
        }}>
          <Radio value={'browser'}>浏览器html</Radio>
          <Radio value={'url'}>url</Radio>
        </Radio.Group>
      </Item>
      <Item label="状态" labelCol={{ span: 4 }}>
        <Radio.Group name="status" defaultValue={local.data.status} onChange={e => {
          local.data.status = e.target.value;
        }}>
          <Radio value={0}>已创建</Radio>
          <Radio value={1}>运行中</Radio>
          <Radio value={2}>已废弃</Radio>
          <Radio value={3}>等待中</Radio>
        </Radio.Group>
      </Item>
      <Item label="规则" labelCol={{ span: 4 }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <p>{local.data.pattern}</p>
          {local.data.urls.length === 0 && <label style={{ lineHeight: '32px' }}>暂无数据</label>}
          {local.data.urls.map((item, i) => <Input key={i} value={item.url} readOnly addonAfter={<Switch checked={item.enabled} onChange={v => {
            item.enabled = v;
            local.data.pattern = item.url;
          }} />} addonBefore={item.enabled ? '开启' : '关闭'} />)}
          <Input addonBefore="添加" ref={ref => urlRef.current = ref} addonAfter={<Icon type="check" onClick={() => {
            if (urlRef.current) {
              const url = urlRef.current.input.value.trim();
              if (url) {
                local.data.urls.push({ url, enabled: false });
              } else {
                notification.warning({ message: '请输入有效规则' })
              }
            }
          }} />} />
        </Space>
      </Item>
      <Item label="extra脚本" labelCol={{ span: 4 }} >
        <Input.TextArea onChange={e => {
          local.data.extra = e.target.value
        }} />
      </Item>
      <Item>
        <CodeEditor value={local.data.script} onChange={v => local.data.script = v} />
      </Item>
    </Form>
  </Modal>)}</Observer>;
}