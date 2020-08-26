import React from 'react'
import { Modal, Form, Input, notification, Radio, Select, Card, Row, Col, Divider } from 'antd'
import { Observer, useLocalStore } from 'mobx-react-lite';
import * as _ from 'lodash';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

export default function GroupAdd({ cancel, save, data }) {
  const lb = { span: 6, offset: 3 }, rb = { span: 12 }
  const store = useLocalStore(() => ({
    data: data.id ? _.cloneDeep(data) : { refs: [], nth: 1, attrs: {}, params: {}, more: {}, ...data },
    loading: false,
    ref: '',
    maps: [
      { key: 'picker', value: 'picker' },
      { key: 'filter', value: 'filter' },
      { key: 'filter-row', value: 'filter-row' },
      { key: 'filter-tag', value: 'filter-tag' },
      { key: 'tab', value: 'tab' },
      { key: 'tab-pane', value: 'tab-pane' },
      { key: 'menu-grid', value: 'menu-grid' },
      { key: 'menu', value: 'menu' },
      { key: 'tree-node', value: 'tree-node' },
    ],
  }))
  store.data.params = JSON.stringify(store.data.params)
  // for (let m in mapping) {
  //   store.maps.push({ key: m, value: mapping[m].name })
  // }
  // tree_id parent_id id
  // name desc view nth
  // refs attrs params more 
  return <Observer>{() => (
    <Modal
      style={{ overflow: 'auto', padding: 0 }}
      width={1000}
      bodyStyle={{ height: 600, overflow: 'auto' }}
      title={data ? '编辑组件' : '添加组件'}
      visible={true}
      onCancel={cancel}
      onOk={async () => {
        save(JSON.parse(JSON.stringify(store.data)));
        cancel()
        // try {
        //   store.data.params = JSON.parse(store.data.params)
        // } catch (err) {
        //   notification.info({ message: 'params格式错误' })
        //   return
        // }
        // if (store.loading) {
        //   return;
        // }
        // store.loading = true;
        // const result = await save(store.data)
        // store.loading = false
        // if (result) {
        //   cancel()
        // } else {
        //   notification.info({ message: '操作失败' })
        // }
      }}
    >
      <Form>
        <Form.Item label='组件名称' labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.title} autoFocus onChange={e => store.data.title = e.target.value} />
        </Form.Item>
        <Form.Item label='唯一标识' labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.name} onChange={e => store.data.name = e.target.value} />(name)
        </Form.Item>
        <Form.Item label='序号' labelCol={lb} wrapperCol={rb}>
          <Input type="number" value={store.data.nth} onChange={e => store.data.nth = e.target.value} />
        </Form.Item>
        <Form.Item label='组件描述' labelCol={lb} wrapperCol={rb}>
          <Input value={store.data.desc} onChange={e => store.data.desc = e.target.value} />
        </Form.Item>
        <Form.Item label='视图类型' labelCol={lb} wrapperCol={rb}>
          <Select value={store.data.view} onChange={value => store.data.view = value}>
            <Select.Option value="">根视图</Select.Option>
            {store.maps.map(m => <Select.Option key={m.key} value={m.key}>{m.value}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label='开放' labelCol={lb} wrapperCol={rb}>
          <Radio.Group
            value={store.data.open}
            options={[{ label: '显示', value: true }, { label: '隐藏', value: false }]}
            onChange={e => store.data.open = e.target.value}
          />
        </Form.Item>
        <Form.Item label='数据列表' labelCol={lb} wrapperCol={rb}>
          {store.data.refs.map((ref, index) => <Input value={ref} key={index} onChange={e => {
            store.data.refs[index] = e.target.value
          }} addonAfter={<CloseCircleOutlined type="close-circle" onClick={e => {
            store.data.refs.splice(index, 1)
          }} />} />)}
          <Input
            value={store.ref}
            onChange={e => store.ref = e.target.value}
            addonAfter={<PlusCircleOutlined onClick={() => {
              if (store.ref.trim() !== '') {
                store.data.refs.push(store.ref)
                store.ref = ''
              }
            }} />}
          />
        </Form.Item>
        <Divider />
        <Row>
          <Col span={18} offset={6}>
            <Card title="attrs属性">
              <Form.Item label='默认选中' labelCol={lb} wrapperCol={rb}>
                <Radio.Group
                  value={store.data.attrs.selected}
                  options={[{ label: '选中', value: true }, { label: '不选中', value: false }]}
                  onChange={e => { store.data.attrs.selected = e.target.value }}
                />
              </Form.Item>
              <Form.Item label='换一换' labelCol={lb} wrapperCol={rb}>
                <Radio.Group
                  value={store.data.attrs.random}
                  options={[{ label: '显示', value: true }, { label: '隐藏', value: false }]}
                  onChange={e => store.data.attrs.random = e.target.value}
                />
              </Form.Item>
              <Form.Item label='轮播延时' labelCol={lb} wrapperCol={rb}>
                <Input type="number" value={store.data.attrs.timeout} onChange={e => store.data.attrs.timeout = e.target.value} />
              </Form.Item>
              <Form.Item label='分栏数' labelCol={lb} wrapperCol={rb}>
                <Input type="number" value={store.data.attrs.columns} onChange={e => store.data.attrs.columns = e.target.value} />
              </Form.Item>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={18} offset={6}>
            <Card title="更多跳转设置">
              <Form.Item label='频道' labelCol={lb} wrapperCol={rb}>
                <Input value={store.data.more.channel_id} onChange={e => store.data.more.channel_id = e.target.value} />
              </Form.Item>
              <Form.Item label='类型' labelCol={lb} wrapperCol={rb}>
                <Input value={store.data.more.type} onChange={e => store.data.more.type = e.target.value} />
              </Form.Item>
              <Form.Item label='关键字' labelCol={lb} wrapperCol={rb}>
                <Input value={store.data.more.keyword} onChange={e => store.data.more.keyword = e.target.value} />
              </Form.Item>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={18} offset={6}>
            <Card title="params与query">
              <Form.Item label='频道' labelCol={lb} wrapperCol={rb}>
                <Input.TextArea value={store.data.params} onChange={e => store.data.params = e.target.value}></Input.TextArea>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  )}</Observer>
}