import React, { useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, Switch, Form, Input, notification, Radio, Select, Card, Row, Col, Divider } from 'antd';
import { FullHeight, FullHeightFix, FullHeightAuto, CenterXY, AlignAside, Right, FullWidth, FullWidthFix, FullWidthAuto } from '../../../component/style'
import { Icon, } from '../../../component'
import { TabHeader, TabTag } from './style'

const tabs = [
  { tab: 'base', title: '基本' },
  { tab: 'attrs', title: '属性' },
  { tab: 'route', title: '跳转' },
  { tab: 'more', title: '更多' },
]

function RenderHeader({ tab = 'base', setTab, onClose }) {
  return <TabHeader onClick={e => {
    const node = e.target;
    if (node.tagName === 'SPAN') {
      setTab && setTab(node.dataset.name)
    }
  }}>
    <div style={{ display: 'flex', flex: 1 }}>
      {tabs.map(item => (<TabTag data-name={item.tab} className={tab === item.tab ? 'active' : ''} key={item.tab}>{item.title}</TabTag>))}
    </div>
    <div onClick={onClose}><Icon type="delete" /></div>
  </TabHeader>
}

export default function GroupEdit({ group, onClose, openPick }) {
  const jsoneditor = useRef(null)
  const lb = { span: 6, offset: 3 }, rb = { span: 12 }
  const local = useLocalStore(() => ({
    ref: '',
    tab: 'base',
    paramsError: false,
    setTab(tab) {
      this.tab = tab
    },
  }))
  if (!group) {
    return null;
  }
  return <Observer>{() => (
    <FullHeight style={{ width: 300, backgroundColor: 'wheat' }}>
      <FullWidth>
        <RenderHeader tabs={tabs} tab={local.tab} setTab={local.setTab} onClose={onClose} />
      </FullWidth>
      <FullHeightAuto>
        <Form style={{ height: 700, display: local.tab === 'base' ? 'block' : 'none' }}>
          <Form.Item label='是否删除' labelCol={lb} wrapperCol={rb}>
            <FullWidth>
              <Switch checked={group.$delete} onChange={() => group.setKey('$delete', !group.$delete)} /><Divider type="vertical" />{group.$delete ? '删除' : '不删除'}
            </FullWidth>
          </Form.Item>
          <Form.Item label='组件名称' labelCol={lb} wrapperCol={rb}>
            <Input value={group.title} onChange={e => group.setKey('title', e.target.value)} />
          </Form.Item>
          <Form.Item label='唯一标识' labelCol={lb} wrapperCol={rb}>
            <Input value={group.name} onChange={e => group.setKey('name', e.target.value)} />(name)
                </Form.Item>
          <Form.Item label='序号' labelCol={lb} wrapperCol={rb}>
            <Input type="number" value={group.nth} onChange={e => group.setKey('nth', parseInt(e.target.value) || 0)} />
          </Form.Item>
          <Form.Item label='组件描述' labelCol={lb} wrapperCol={rb}>
            <Input value={group.desc} onChange={e => group.setKey('desc', e.target.value)} />
          </Form.Item>
          <Form.Item label='视图类型' labelCol={lb} wrapperCol={rb}>
            <Select value={group.view} onChange={value => group.setKey('view', value)}>
              <Select.Option value="">请选择</Select.Option>
              {/* TODO: views */}
              {[].map(m => <Select.Option key={m.key} value={m.key}>{m.value}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label='开放' labelCol={lb} wrapperCol={rb}>
            <FullWidth>
              <Switch checked={group.open} onChange={() => group.setKey('open', !group.open)} /><Divider type="vertical" />{group.open ? '显示' : '隐藏'}
            </FullWidth>
          </Form.Item>
          <Form.Item label='数据列表' labelCol={lb} wrapperCol={rb}>
            {(group.refs || []).map((ref, index) => <Input value={ref} disabled key={index} onChange={e => {
              group.refs[index] = e.target.value
            }} addonAfter={<Icon type="delete" onClick={e => {
              group.removeRef(index)
            }} />} />)}
            <Button type="primary" onClick={() => openPick()}>添加数据</Button>
            {/* <Input
              value={local.ref}
              onChange={e => local.ref = e.target.value}
              addonAfter={<Icon type="circle-plus" onClick={() => {
                if (local.ref.trim() !== '') {
                  // TODO: async load data
                  group.addRef(local.ref)
                  local.ref = ''
                }
              }} />}
            /> */}
          </Form.Item>
        </Form>
        <Form style={{ height: 700, display: local.tab === 'attrs' ? 'block' : 'none' }}>
          <Row>
            <Col>
              <h2 style={{ textIndent: 20 }}>attr属性</h2>
              <Form.Item label='默认选中' labelCol={lb} wrapperCol={rb}>
                <FullWidth>
                  <Switch checked={group.attrs.selected} onChange={() => group.setKey('attrs.selected', !group.attrs.selected)} /><Divider type="vertical" />{group.open ? '选中' : '不选中'}
                </FullWidth>
              </Form.Item>
              <Form.Item label='换一换' labelCol={lb} wrapperCol={rb}>
                <FullWidth>
                  <Switch checked={group.attrs.random} onChange={() => group.setKey('attrs.random', !group.attrs.random)} /><Divider type="vertical" />{group.open ? '显示' : '不显示'}
                </FullWidth>
              </Form.Item>
              <Form.Item label='轮播延时' labelCol={lb} wrapperCol={rb}>
                <Input type="number" value={group.attrs.timeout} onChange={e => group.setKey('attrs.timeout', parseInt(e.target.value) || 0)} />
              </Form.Item>
              <Form.Item label='分栏数' labelCol={lb} wrapperCol={rb}>
                <Input type="number" value={group.attrs.columns} onChange={e => group.setKey('attrs.columns', parseInt(e.target.value) || 0)} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form style={{ height: 700, display: local.tab === 'route' ? 'block' : 'none' }}>
          <Row>
            <Col>
              <h2 style={{ textIndent: 20 }}>更多跳转设置</h2>
              <Form.Item label='频道' labelCol={lb} wrapperCol={rb}>
                <Input value={group.more.channel_id} onChange={e => group.setKey('more.channel_id', e.target.value)} />
              </Form.Item>
              <Form.Item label='类型' labelCol={lb} wrapperCol={rb}>
                <Input value={group.more.type} onChange={e => group.setKey('more.type', e.target.value)} />
              </Form.Item>
              <Form.Item label='关键字' labelCol={lb} wrapperCol={rb}>
                <Input value={group.more.keyword} onChange={e => group.setKey('more.keyword', e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form style={{ height: 700, display: local.tab === 'more' ? 'block' : 'none' }}>
          <Row>
            <Col>
              <h2 style={{ textIndent: 20 }}>params与query</h2>
              <Form.Item label='频道' labelCol={lb} wrapperCol={rb}>
                <Input.TextArea
                  style={{ borderColor: local.paramsError ? 'red' : '' }}
                  ref={ref => jsoneditor.current = ref}
                  defaultValue={JSON.stringify(group.params)}
                  onBlur={(e) => {
                    let params = {}
                    if (jsoneditor.current) {
                      try {
                        params = JSON.parse(jsoneditor.current.state.value)
                        local.paramsError = false
                        group.setKey('params', params)
                      } catch (err) {
                        local.paramsError = true
                      }
                    }
                  }}
                ></Input.TextArea>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}