import React, { useEffect, useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api';
import { useStore } from '../../../contexts'
import { Button, Switch, Form, Input, notification, Radio, Select, Card, Row, Col, Divider } from 'antd';
import { FullHeight, FullHeightFix, FullHeightAuto, CenterXY, AlignAside, Right, FullWidth, FullWidthFix, FullWidthAuto } from '../../../component/style'
import AutoView from '../../../Group/AutoView'
import { Mobile, Icon, VisualBox } from '../../../component'
import GroupEdit from './Edit'
import models from '../../../models'

export default function GroupManagePage() {
  const store = useStore()
  const local = useLocalStore(() => ({
    createLoading: false,
    showGroupEdit: false,
    tree: null,
    temp: null,
    refreshing: false,
    config: null,
    async refreshData() {
      const res = await apis.getGroupTrees()
      store.groups = res.data.map(item => models.group.create(item))
    },
  }))
  const lb = { span: 6, offset: 3 }, rb = { span: 12 }
  const init = useCallback(async () => {
    local.refreshing = true
    await local.refreshData()
    let tree_id = window.localStorage.getItem('choose_group_id')
    if (tree_id) {
      local.tree = store.groups.find(group => group.id === tree_id)
    }
    if (!local.tree && store.groups.length !== 0) {
      local.tree = store.groups[0]
    }
    local.refreshing = false
  })
  useEffect(() => {
    init()
  })
  return <Observer>{() => (
    <FullHeight>
      <AlignAside style={{ margin: '0 15%' }}>
        <Select disabled={local.refreshing} style={{ width: 200, marginRight: 20 }} value={local.tree ? local.tree.title : ''} onChange={async (value) => {
          window.localStorage.setItem('choose_group_id', value)
          init()
        }}>
          <Select.Option value="">请选择</Select.Option>
          {store.groups.map(group => (
            <Select.Option key={group.id} value={group.id}>{group.title}</Select.Option>
          ))}
        </Select>
        <Button.Group>
          <Button type="primary" disabled={local.tree === null || local.refreshing} onClick={() => {
            local.temp = local.tree
            local.showGroupEdit = true
          }}>编辑root</Button>
          <Button type="primary" onClick={() => {
            local.temp = {}
            local.showGroupEdit = true
          }}>添加root</Button>
          <Button type="primary" onClick={async () => {
            await apis.destroyGroup(local.tree)
            local.tree = null
          }}>删除root</Button>
        </Button.Group>
        <Divider type="verticle" />
        <Button type="primary" loading={local.refreshing} onClick={async () => {
          init()
        }}>刷新数据</Button>
        <Divider type="verticle" />
        <Switch title="编辑" checked={store.app.groupMode === 'edit'} onChange={() => store.app.toggleGroupMode()} />
      </AlignAside>
      <FullWidth style={{ height: '100%', margin: '10px 0' }}>
        <FullHeight>
          xxx
        </FullHeight>
        <FullWidthAuto>
          <CenterXY>
            <Mobile style={{ boxShadow: '#77b6e4 5px 5px 16px 7px', border: '1px solid #77b6e4' }}>
              {local.refreshing === false && local.tree && (
                <AutoView
                  self={local.tree}
                  mode={store.app.groupMode}
                  addGroup={data => {
                    local.temp = data
                    local.showGroupEdit = true
                  }}
                  editGroup={data => {
                    local.temp = data
                    local.showGroupEdit = true
                  }}
                  destroyGroup={async data => {
                    await apis.destroyGroup(data)
                    init()
                  }}
                  renderItem={item => (
                    // <BookItem item={item} />
                    <div>fuck</div>
                  )}
                />
              )}
            </Mobile>
          </CenterXY>
        </FullWidthAuto>
        <FullHeight>
          {local.config !== null && (
            <FullHeightAuto>
              <Form>
                <Form.Item label='组件名称' labelCol={lb} wrapperCol={rb}>
                  <Input value={local.config.title} autoFocus onChange={e => local.config.title = e.target.value} />
                </Form.Item>
                <Form.Item label='唯一标识' labelCol={lb} wrapperCol={rb}>
                  <Input value={local.config.name} onChange={e => local.config.name = e.target.value} />(name)
            </Form.Item>
                <Form.Item label='序号' labelCol={lb} wrapperCol={rb}>
                  <Input type="number" value={local.config.nth} onChange={e => local.config.nth = e.target.value} />
                </Form.Item>
                <Form.Item label='组件描述' labelCol={lb} wrapperCol={rb}>
                  <Input value={local.config.desc} onChange={e => local.config.desc = e.target.value} />
                </Form.Item>
                <Form.Item label='视图类型' labelCol={lb} wrapperCol={rb}>
                  <Select value={local.config.view} onChange={value => local.config.view = value}>
                    <Select.Option value="">根视图</Select.Option>
                    {/* TODO: views */}
                    {[].map(m => <Select.Option key={m.key} value={m.key}>{m.value}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item label='开放' labelCol={lb} wrapperCol={rb}>
                  <Radio.Group
                    value={local.config.open}
                    options={[{ label: '显示', value: true }, { label: '隐藏', value: false }]}
                    onChange={e => local.config.open = e.target.value}
                  />
                </Form.Item>
                <Form.Item label='数据列表' labelCol={lb} wrapperCol={rb}>
                  {local.config.refs.map((ref, index) => <Input value={ref} key={index} onChange={e => {
                    local.config.refs[index] = e.target.value
                  }} addonAfter={<Icon type="delete" onClick={e => {
                    local.config.refs.splice(index, 1)
                  }} />} />)}
                  <Input
                    value={store.ref}
                    onChange={e => store.ref = e.target.value}
                    addonAfter={<Icon type="circle-plus" onClick={() => {
                      if (store.ref.trim() !== '') {
                        local.config.refs.push(store.ref)
                        store.ref = ''
                      }
                    }} />}
                  />
                </Form.Item>
                <Divider />
                <Row>
                  <Col span={18} offset={6}>
                    <Card title="attrs属性">
                      <Form.Item label='隐藏标题' labelCol={lb} wrapperCol={rb}>
                        <Radio.Group
                          value={local.config.attrs.hide_title}
                          options={[{ label: '显示', value: false }, { label: '隐藏', value: true }]}
                          onChange={e => { local.config.attrs.hide_title = e.target.value }}
                        />
                      </Form.Item>
                      <Form.Item label='默认选中' labelCol={lb} wrapperCol={rb}>
                        <Radio.Group
                          value={local.config.attrs.selected}
                          options={[{ label: '选中', value: true }, { label: '不选中', value: false }]}
                          onChange={e => { local.config.attrs.selected = e.target.value }}
                        />
                      </Form.Item>
                      <Form.Item label='换一换' labelCol={lb} wrapperCol={rb}>
                        <Radio.Group
                          value={local.config.attrs.allowChange}
                          options={[{ label: '显示', value: true }, { label: '隐藏', value: false }]}
                          onChange={e => local.config.attrs.allowChange = e.target.value}
                        />
                      </Form.Item>
                      <Form.Item label='轮播延时' labelCol={lb} wrapperCol={rb}>
                        <Input type="number" value={local.config.attrs.timeout} onChange={e => local.config.attrs.timeout = e.target.value} />
                      </Form.Item>
                      <Form.Item label='分栏数' labelCol={lb} wrapperCol={rb}>
                        <Input type="number" value={local.config.attrs.columns} onChange={e => local.config.attrs.columns = e.target.value} />
                      </Form.Item>
                      <Form.Item label='最多显示' labelCol={lb} wrapperCol={rb}>
                        <Input type="number" value={local.config.attrs.showCount} onChange={e => local.config.attrs.showCount = e.target.value} />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={18} offset={6}>
                    <Card title="更多跳转设置">
                      <Form.Item label='频道' labelCol={lb} wrapperCol={rb}>
                        <Input value={local.config.more.channel_id} onChange={e => local.config.more.channel_id = e.target.value} />
                      </Form.Item>
                      <Form.Item label='类型' labelCol={lb} wrapperCol={rb}>
                        <Input value={local.config.more.type} onChange={e => local.config.more.type = e.target.value} />
                      </Form.Item>
                      <Form.Item label='关键字' labelCol={lb} wrapperCol={rb}>
                        <Input value={local.config.more.keyword} onChange={e => local.config.more.keyword = e.target.value} />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={18} offset={6}>
                    <Card title="params与query">
                      <Form.Item label='频道' labelCol={lb} wrapperCol={rb}>
                        <Input.TextArea value={local.config.params} onChange={e => local.config.params = e.target.value}></Input.TextArea>
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </FullHeightAuto>
          )}
          <FullHeightFix>
            <VisualBox visible={local.config !== null}>
              <Button>提交</Button>
            </VisualBox>
          </FullHeightFix>
        </FullHeight>
      </FullWidth>
      {local.showGroupEdit && <GroupEdit
        data={local.temp}
        cancel={() => { local.temp = null; local.showGroupEdit = false }}
        save={async (data) => {
          try {
            if (data.id) {
              await apis.updateGroup(data)
            } else {
              await apis.createGroup(data)
            }
            // window.localStorage.setItem('choose_group_id', null)
            // local.tree = null
            init()
            return true
          } catch (err) {
            return false
          }
        }}
      />}
      <FullHeightFix>
        <Right style={{ margin: '0 15%' }}>
          <Button loading={local.addLoading} type="primary" disabled={local.refreshing || local.tree === null} onClick={async () => {
            local.temp = { parent_id: local.tree ? local.tree.id : '', tree_id: local.tree ? local.tree.id : '', view: 'picker' }
            local.showGroupEdit = true
          }}>添加视图</Button>
        </Right>
      </FullHeightFix>
    </FullHeight>
  )
  }</Observer >
}