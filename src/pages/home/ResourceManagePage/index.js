import React, { useEffect, useCallback, useRef, Fragment } from 'react';
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api';
import ResourceList from './List'
import ResourceEdit from './Edit'
import { Button, Input, Select, Switch, Divider, notification, Modal, Form, Upload, Row, Col } from 'antd';
import { Icon } from '../../../component'
import { UploadOutlined } from '@ant-design/icons'
import store from '../../../store'
import { Right } from '../../../component/style';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import path2regexp from 'path-to-regexp'

const { getResources, createResource, updateResource, destroyResource, getGroupTypes, v2getRules, v2GetResourceByRule, v2previewRule } = apis

async function destroy(data) {
  return await destroyResource(data)
}

async function save(data) {
  window.open(`${store.app.baseUrl}/v1/admin/book/${data.id}/store?token=${store.user.token}`, '_blank')
}

export default function ResourceManagePage() {
  const lb = { span: 3 }, rb = { span: 18 }
  const picture = useRef(null)
  const local = useLocalStore(() => ({
    isLoading: false,
    showEdit: false,
    showFastEdit: false,
    temp: null,
    thumbnail: '',
    count: 0,
    search_name: '',
    search_type: '',
    search_status: '',
    search_key: 'name',
    search_page: 1,
    categories: {},
    resources: [],
    rules: store.rules,
    rule: {}
  }))
  const urlRef = useRef(null)
  const originRef = useRef(null)
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      search: local.search_name,
      source_type: local.search_type,
      status: local.search_status,
      page: local.search_page,
    }
    getResources(query).then(res => {
      local.isLoading = false
      local.count = res.count
      local.resources = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  const init = useCallback(async () => {
    local.rule = {};
    local.isLoading = true
    const result = await v2getRules({ page: local.search_page })
    local.isLoading = false
    local.rules = result.data
    store.rules = result.data
  }, [])
  useEffect(() => {
    search()
  }, [])
  useEffectOnce(() => {
    if (local.rules.length === 0) {
      init();
    }
    getGroupTypes().then(result => {
      local.categories = result.data
      console.log(result, 'types')
    })
  }, [])
  return (<Observer>{() => {
    return <div className={'box'}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: 10 }}>
          <Input
            style={{ width: 250 }}
            value={local.search_name}
            addonBefore={<Select value={local.search_key} onChange={value => {
              local.search_key = value;
            }}>
              <Select.Option value="name">??????</Select.Option>
              <Select.Option value="id">id</Select.Option>
            </Select>} onChange={e => {
              local.search_name = e.target.value
            }} onKeyDown={e => {
              if (e.keyCode === 13) {
                search()
              }
            }} />
          <Divider type="vertical" />
          ??????
          <Divider type="vertical" />
          <Select style={{ width: 150 }} value={local.search_status} onChange={value => {
            local.search_status = value
            local.search_page = 1
            search()
          }}>
            <Select.Option value="">??????</Select.Option>
            <Select.Option value="init">?????????</Select.Option>
            <Select.Option value="loading">loading</Select.Option>
            <Select.Option value="finished">??????</Select.Option>
            <Select.Option value="fail">??????</Select.Option>
          </Select>
          <Divider type="vertical" />
          ????????????
          <Divider type="vertical" />
          <Select style={{ width: 150 }} value={local.search_type} onChange={value => {
            local.search_type = value
            local.search_page = 1
            search()
          }}>
            <Select.Option value="">??????</Select.Option>
            <Select.Option value="file">??????</Select.Option>
            <Select.Option value="image">??????</Select.Option>
            <Select.Option value="music">??????</Select.Option>
            <Select.Option value="video">??????</Select.Option>
            <Select.Option value="novel">??????</Select.Option>
            <Select.Option value="article">??????</Select.Option>
            <Select.Option value="news">??????</Select.Option>
            <Select.Option value="private">??????</Select.Option>
          </Select>
          <Divider type="vertical" />
          <Button type="primary" onClick={() => {
            search()
          }}>??????</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={() => { local.temp = {}; local.showEdit = true }}>????????????</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={() => {
            local.tempId = ''
            local.tempRule = {}
            Modal.confirm({
              title: '????????????',
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
                      <Select.Option value="">??????????????????</Select.Option>
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
              okText: '??????',
              cancelText: '??????',
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
                    return notification.error({ message: '???????????????rule' })
                  }
                  if (local.tempRule.type === 'pixiv') {
                    return window.open(`${store.app.baseUrl}/v1/admin/pixiv-preview?id=${id}`)
                  }
                  v2previewRule(local.tempId, { origin: id }).then(res => {
                    if (res.code === 0) {
                      notification.success({ message: 'success' })
                      Modal.confirm({
                        title: '????????????',
                        okText: '??????',
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
          }}>??????<Icon type="page-search" /></Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={() => {
            local.tempId = ''
            local.tempRule = {}
            Modal.confirm({
              title: '????????????',
              content: <Observer>{() => (<Fragment>
                <Select value={local.tempId} onSelect={value => { local.tempId = value }}>
                  <Select.Option value="">??????????????????</Select.Option>
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
              okText: '??????',
              cancelText: '??????',
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
            ????????????
          <Icon type="circle-plus" />
          </Button>
          <Divider type="vertical" />
        </div>
        <div style={{ flex: '1 0 0%', overflow: 'auto' }}>
          <ResourceList
            items={local.resources}
            openEdit={(data) => { local.temp = data; local.showEdit = true; }}
            fastEdit={(data) => { local.temp = data; local.showFastEdit = true; }}
            destroy={async function (data) {
              await destroy(data)
              search()
            }}
            categories={local.categories}
            search={search}
            store={save}
            local={local}
          />
        </div>

      </div>
      {local.showEdit && <ResourceEdit data={local.temp} categories={local.categories[local.search_type] || []} cancel={() => { local.showEdit = false }} save={async (data) => {
        let res
        if (data.id) {
          res = await updateResource(data)
        } else {
          res = await createResource(data)
        }
        search()
        return res
      }} />}
      {
        local.showFastEdit && (
          <Modal
            visible={true}
            closable={false}
            footer={<Right>
              <Button type="ghost" loading={local.isLoading} onClick={() => local.showFastEdit = false}>??????</Button>
              <Divider type="vertical" />
              <Button type="primary" loading={local.isLoading} onClick={async () => {
                local.isLoading = true
                try {
                  await updateResource(local.temp)
                  local.showFastEdit = false
                  local.thumbnail = ''
                } catch (e) {

                }
                local.isLoading = false

              }}>??????</Button>
            </Right>}
          >
            <Form>
              <Form.Item label="??????" labelCol={lb} wrapperCol={rb}>
                <Input value={local.temp.title} autoFocus onChange={e => local.temp.title = e.target.value} />
              </Form.Item>
              <Form.Item label="?????????" labelCol={lb} wrapperCol={rb}>
                <Upload
                  style={{ position: 'relative' }}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false} ref={picture} name="thumbnail" onChange={e => {
                    local.temp.thumbnail = e.file
                    const reader = new FileReader();
                    reader.addEventListener('load', () => { local.thumbnail = reader.result });
                    reader.readAsDataURL(e.file);
                  }} beforeUpload={(f) => {
                    return false
                  }}>
                  <img width="100%" src={(local.thumbnail.startsWith('data') ? local.thumbnail : store.app.imageLine + (local.temp.thumbnail || '/images/poster/nocover.jpg'))} alt="" />
                  <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                    <UploadOutlined /> ??????
              </Button>
                </Upload>
              </Form.Item>
              <Form.Item label="????????????" labelCol={lb} wrapperCol={rb}>
                <Select value={local.temp.source_type || ''} onChange={value => {
                  local.temp.source_type = value
                  local.temp.type = ""
                }}>
                  {store.resource_types.map(type => <Select.Option value={type.name} key={type.name}>{type.title}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item label="??????" labelCol={lb} wrapperCol={rb}>
                <Select value={local.temp.type} onChange={e => local.temp.type = e.target.value}>
                  <Select.Option value="">?????????</Select.Option>
                  {(local.categories[local.temp.type] || []).map(cata => (<Select.Option value={cata.name}>{cata.title}</Select.Option>))}
                </Select>
              </Form.Item>
              <Form.Item label="??????" labelCol={lb} wrapperCol={rb}>
                <Input value={local.temp.series} onChange={e => local.temp.series = e.target.value} />
              </Form.Item>
              <Form.Item label="??????" labelCol={lb} wrapperCol={rb}>
                <Switch checked={local.temp.open} onClick={e => {
                  local.temp.open = !local.temp.open
                }} /> {local.temp.open}
              </Form.Item>
              <Form.Item label="??????" labelCol={lb} wrapperCol={rb}>
                <Switch checked={local.temp.status === 'loading'} onClick={e => {
                  local.temp.status = local.temp.status === 'finished' ? 'finished' : 'loading'
                }} />
              </Form.Item>
            </Form>
          </Modal>
        )
      }
    </div>
  }}</Observer>)
}
