import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, Modal, Form, Input, Switch, Divider, notification, Table, Select, Upload, Row, Col, Tag } from 'antd';
import { Icon } from '../../../component'
import apis from '../../../api';
import store from '../../../store'
import { UploadOutlined, } from '@ant-design/icons'
import { FullHeight, FullHeightFix, FullHeightAuto } from '../../../component/style'
import IconCode from '../../../images/code.svg'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import path2regexp from 'path-to-regexp'
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

const { Column } = Table;
const { v2getRules, v2createRule, v2updateRule, v2GetResourceByRule, v2UpdateRuleCode, v2getRuleCode, v2previewRule } = apis

export default function SpiderPage() {
  const lb = { span: 6, offset: 3 }, rb = { span: 12 }
  const urlRef = useRef(null)
  const originRef = useRef(null)
  const mainFile = useRef(null)
  const subFile = useRef(null)
  const inp = useRef(null)
  const local = useLocalStore(() => ({
    isLoading: false,
    rule: {
      id: '',
      type: '',
      name: '',
      desc: '',
      host: '',
      enable: false,
      mainScript: '',
      subFile: '',
      queries: [],
    },
    rules: [],
    tagAddVisible: false,
    tempTag: '',
    // 预览
    tempId: '',
    tempRule: {},
    showEdit: false,
    inster: false,
    search_page: 1,
    count: 0,
    // code
    showCodeId: '',
    loadCode: false,
    code: '',
  }))
  function openEdit(data) {
    if (data) {
      local.rule = data;
      local.inster = false
    } else {
      local.rule = { queries: [] }
      local.inster = true
    }
    local.showEdit = true
  }
  const init = useCallback(async () => {
    local.rule = {};
    local.isLoading = true
    const result = await v2getRules({ page: local.search_page })
    result.data.forEach(rule => {
      if (!rule.queries) {
        rule.queries = []
      }
    })
    local.isLoading = false
    local.rules = result.data
  }, [])
  useEffect(() => {
    init()
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: 15, alignItems: 'flex-end' }}>
        <Button type="primary" onClick={() => {
          local.tempId = ''
          local.tempRule = {}
          Modal.confirm({
            title: '预览效果',
            content: <Observer>{() => <Fragment>
              <Row gutter={[16, 8]} >
                <Col span={18}>
                  <Select style={{ width: '100%' }} value={local.tempId} onSelect={value => {
                    local.tempId = value
                    local.rules.forEach(rule => {
                      if (rule.id === value) {
                        local.tempRule = rule
                      }
                    })
                  }}>
                    <Select.Option value="">自动选择规则</Select.Option>
                    {local.rules.map(rule => <Select.Option key={rule.id} value={rule.id}>{rule.name}</Select.Option>)}
                  </Select>
                </Col>
                <Col span={6}>
                  <Input disabled value={local.tempRule ? local.tempRule.type : ''} />
                </Col>
              </Row>
              <Input ref={ref => originRef.current = ref} onPaste={e => {
                const url = e.clipboardData.getData('text/plain');
                const u = new URL(url);
                local.rules.forEach(rule => {
                  const reg = path2regexp(rule.route);
                  const m = reg.exec(u.pathname)
                  if (url.startsWith(rule.host) && ((rule.route && m) || !rule.route)) {
                    local.tempId = rule.id
                    local.tempRule = rule
                  }
                })
              }} />
            </Fragment>}</Observer>,
            okText: '预览',
            cancelText: '取消',
            onOk: () => {
              if (originRef.current) {
                const id = originRef.current.state.value
                let found = false
                local.rules.forEach(rule => {
                  if (id.startsWith(rule.host)) {
                    found = true
                  }
                })
                if (found === false) {
                  return notification.error({ message: '没有匹配的rule' })
                }
                if (local.tempRule.type === 'pixiv') {
                  return window.open(`${store.app.baseUrl}/v1/admin/pixiv-preview?id=${id}`)
                }
                v2previewRule(local.tempId, { origin: id }).then(res => {
                  if (res.code === 0) {
                    notification.success({ message: 'success' })
                    Modal.confirm({
                      title: '预览结果',
                      okText: '确定',
                      cancelButtonProps: { hidden: true },
                      width: 700,
                      content: <CodeMirror
                        value={JSON.stringify(res.data, null, 2)}
                        options={{
                          mode: 'json',
                          theme: 'material',
                          lineNumbers: true
                        }}
                        onChange={(editor, data, value) => {
                          local.code = value;
                        }}
                      />
                    })
                  } else {
                    notification.error({ message: res.message })
                  }
                })
              } else {
                notification.error({ message: 'ref fail' })
              }
            },
            onCancel: () => {
              originRef.current = null
            }
          });
          setTimeout(() => {
            if (originRef.current) {
              originRef.current.focus()
            }
          }, 100)
        }}>预览<Icon type="page-search" /></Button>
        <Divider type="vertical" />
        <Button type="primary" onClick={() => {
          local.tempId = ''
          local.tempRule = {}
          Modal.confirm({
            title: '添加任务',
            content: <Observer>{() => (<Fragment>
              <Select value={local.tempId} onSelect={value => { local.tempId = value }}>
                <Select.Option value="">自动选择规则</Select.Option>
                {local.rules.map(rule => <Select.Option key={rule.id} value={rule.id}>{rule.name}</Select.Option>)}
              </Select>
              <Input style={{ marginTop: 10 }} ref={ref => urlRef.current = ref} onPaste={e => {
                const url = e.clipboardData.getData('text/plain');
                const u = new URL(url);
                local.rules.forEach(rule => {
                  const reg = path2regexp(rule.route);
                  const m = reg.exec(u.pathname)
                  if (url.startsWith(rule.host) && ((rule.route && m) || !rule.route)) {
                    local.tempId = rule.id
                    local.tempRule = rule
                  }
                })
              }} />
            </Fragment>)}</Observer>,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              if (urlRef.current) {
                v2GetResourceByRule(local.tempId, urlRef.current.state.value).then(res => {
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
        }}>
          添加任务
          <Icon type="circle-plus" />
        </Button>
        <Divider type="vertical" />
        <Button type="primary" onClick={e => { openEdit() }}>添加规则<Icon type="circle-plus" /></Button>
        <Divider type="vertical" />
        <Button type="primary" disabled={local.isLoading} onClick={() => init()}>刷新</Button>
      </FullHeightFix>
      <FullHeightAuto>
        <Table dataSource={local.rules} rowKey="id" scroll={{ y: 600 }} loading={local.isLoading} pagination={false}>
          <Column title="域名" dataIndex="host" key="host" render={(text, record) => (
            <a href={text} rel="noopener noreferrer" title={record.route} target="_blank">{text}</a>
          )} />
          <Column title="名称" dataIndex="name" key="name" render={(text, record) => {
            return <span title={record.id} style={{ backgroundColor: record.enable ? '' : 'grey' }}>{text}</span>
          }} />
          <Column title="id" dataIndex="id" key="id" />
          <Column title="类型" dataIndex="type" key="type" />
          <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Icon type="edit" title="编辑" onClick={e => {
                openEdit(record)
              }} />
              <Divider type="vertical" />
              <img src={IconCode} style={{ width: 20, height: 24, cursor: 'pointer' }} alt="" onClick={async (e) => {
                if (!local.loadCode) {
                  local.showCodeId = record.id;
                  const result = await v2getRuleCode(record.id);
                  local.loadCode = false;
                  if (result.code === 0) {
                    local.code = result.data.code;
                  } else {
                    notification.error('获取code失败')
                    local.showCodeId = '';
                  }
                }
              }} />
              <Divider type="vertical" />
              <Icon type="delete" title="删除" onClick={e => {
                alert('暂时不能删除')
              }} />
            </div>
          )} />
        </Table>
      </FullHeightAuto>
      {local.showEdit && (
        <Modal
          visible={true}
          style={{ overflow: 'auto', padding: 0 }}
          width={700}
          title={local.inster ? '添加规则' : '修改规则'}
          okText="提交"
          cancelText="取消"
          onCancel={e => { local.inster = false; local.showEdit = false }}
          onOk={async () => {
            local.isLoading = true
            if (local.inster) {
              await v2createRule(local.rule)
            } else {
              await v2updateRule(local.rule)
            }
            await init()
            local.inster = false
            local.showEdit = false
          }}
        >
          <Form>
            <Form.Item label="域名" labelCol={lb} wrapperCol={rb}>
              <Input placeholder="https://www.pixiv.net" onPaste={e => {
                const url = e.clipboardData.getData('text/plain')
                e.preventDefault()
                local.rule.host = url
              }} value={local.rule.host} autoFocus onChange={e => local.rule.host = e.target.value} />
            </Form.Item>
            <Form.Item label="路由规则" labelCol={lb} wrapperCol={rb}>
              <Input placeholder="/:id" value={local.rule.route} onChange={e => local.rule.route = e.target.value} />
            </Form.Item>
            <Form.Item label="路由query" labelCol={lb} wrapperCol={rb}>
              {(local.rule.queries || []).map((tag, index) => <Tag key={index} closable onClose={() => { local.rule.queries = local.rule.queries.filter(t => t !== tag) }}>{tag}</Tag>)}
              {local.tagAddVisible && (
                <Input
                  ref={inp}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={local.tempTag}
                  autoFocus
                  onChange={e => local.tempTag = e.target.value}
                  onBlur={() => {
                    let tagArr = local.tempTag.trim().replace(/,/g, ' ').split(' ');
                    const tags = local.rule.queries
                    for (let i = 0; i < tagArr.length; i++) {
                      const tag = tagArr[i];
                      if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                        local.rule.queries.push(tag)
                      }
                    }
                    local.tagAddVisible = false
                    local.tempTag = ''
                  }}
                />
              )}
              {!local.tagAddVisible && (
                <Tag onClick={() => local.tagAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  <Icon type="plus" />
                </Tag>
              )}
            </Form.Item>
            <Form.Item label="规则名称" labelCol={lb} wrapperCol={rb}>
              <Input placeholder="pixiv插画" value={local.rule.name} autoFocus onChange={e => local.rule.name = e.target.value} />
            </Form.Item>
            <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
              <Input placeholder="novel/pixiv/article/news" value={local.rule.type} autoFocus onChange={e => local.rule.type = e.target.value} />
            </Form.Item>
            <Form.Item label="描述" labelCol={lb} wrapperCol={rb}>
              <Input placeholder="" value={local.rule.desc} autoFocus onChange={e => local.rule.desc = e.target.value} />
            </Form.Item>
            <Form.Item label="状态" labelCol={lb} wrapperCol={rb}>
              <Switch checked={local.rule.enable ? true : false} onClick={e => { local.rule.enable = !local.rule.enable }} /> {local.rule.enable ? '使用中' : '已关闭'}
            </Form.Item>
            <Form.Item label="主资源脚本" labelCol={lb} wrapperCol={rb}>
              <Upload ref={mainFile} name="mainfile" onChange={e => {
                local.rule.mainScript = e.file
              }} beforeUpload={(f) => {
                return false
              }}>
                <Button>
                  <UploadOutlined /> 上传
                </Button>
                {local.rule.mainScript}
              </Upload>
            </Form.Item>
            <Form.Item label="子资源脚本" labelCol={lb} wrapperCol={rb}>
              <Upload ref={subFile} name="subfile" onChange={e => {
                local.rule.subScript = e.file
              }} beforeUpload={(f) => {
                return false
              }}>
                <Button>
                  <UploadOutlined /> 上传
                </Button>
                {local.rule.subScript}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {local.showCodeId && (
        <Modal visible
          style={{ overflow: 'auto', padding: 0 }}
          width={700}
          title="脚本编辑"
          okText="提交"
          cancelText="取消"
          onCancel={e => { local.showCodeId = '' }}
          onOk={e => {
            v2UpdateRuleCode(local.showCodeId, local.code).then(() => {
              local.showCodeId = ''
            });
          }} >
          <CodeMirror
            value={local.code}
            options={{
              mode: 'javascript',
              theme: 'material',
              lineNumbers: true
            }}
            onChange={(editor, data, value) => {
              local.code = value;
            }}
          />
        </Modal>
      )}
    </FullHeight>
  )}</Observer>
}