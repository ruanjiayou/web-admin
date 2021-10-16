import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api'
import { Button, notification, Input, Form, Radio, Tag, Upload, Select, Divider } from 'antd';
import { SortListView } from '../../../component'
import Icon from '../../../component/Icon'
import qs from 'qs'
import * as _ from 'lodash'
import store from '../../../store'
import { toJS } from 'mobx';
import { useRouter } from '../../../contexts'
import { UploadOutlined, PlusCircleOutlined, CloudDownloadOutlined, CloseOutlined } from '@ant-design/icons'
import api from '../../../api';


function deepEqual(a, b) {
  for (let k in a) {
    let equal = true;
    if (_.isPlainObject(a[k])) {
      if (_.isEmpty(a[k]) && !_.isEmpty(b[k])) {
        return false
      }
      equal = deepEqual(a[k], b[k]);
    } else {
      equal = _.isEqual(a[k], b[k]);
    }
    if (!equal) {
      return false;
    }
  }
  return true;
}

export default function ResourceEdit() {
  const picture = useRef(null)
  const inp = useRef(null)
  const inputType = useRef(null)
  const inputUrl = useRef(null)
  const lb = { span: 3 }, rb = { span: 18 }
  const query = qs.parse(window.location.search.substr(1))
  const local = useLocalStore(() => ({
    id: query.id,
    data: { tags: [], types: [], children: [], urls: [] },
    origin: {},
    // 临时
    tempImg: '',
    tempTag: '',
    tempStatus: 'init',
    tagAddVisible: false,
    tempType: 'normal',
    tempTypes: '',
    typeAddVisible: false,
    tempUrl: '',
    urlAddVisible: false,
    loading: false,
  }))
  const onEdit = useCallback(async () => {
    const changed = !deepEqual(toJS(local.origin), toJS(local.data))
    const resp = local.data.id ? await apis.updateResource(local.data) : await api.createResource(local.data);
    if (resp && resp.data.code === 0) {
      notification.info('编辑成功')
    }
  }, [])
  useEffectOnce(() => {
    if (local.id) {
      local.loading = true
      apis.getResource({ id: local.id }).then(res => {
        if (res && res.status === 'success' && res.code === 0) {
          const data = res.data
          local.data = data
          local.origin = data
        } else {
          notification.error({ message: '请求失败' })
        }
        local.loading = false
      })
    }
  })

  return <Observer>{() => (<Fragment>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 20 }}>
        <Form.Item label="标题" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} />
        </Form.Item>
        <Form.Item label="别名" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.alias} onChange={e => local.data.alias = e.target.value} />
        </Form.Item>
        <Form.Item label="系列" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.series} onChange={e => local.data.series = e.target.value} />
        </Form.Item>
        <Form.Item label="发布时间" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.publishedAt} onChange={e => local.data.publishedAt = e.target.value} />
        </Form.Item>
        <Form.Item label="来源" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.origin} onChange={e => local.data.origin = e.target.value} />
        </Form.Item>
        <Form.Item label="来源id" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.source_id} onChange={e => local.data.source_id = e.target.value} />
        </Form.Item>
        <Form.Item label="来源名称" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.source_name} onChange={e => local.data.source_name = e.target.value} />
        </Form.Item>
        <Form.Item label="国家地区" labelCol={lb} wrapperCol={rb}>
          <Select value={local.data.country} onChange={value => {
            local.data.country = value
          }}>
            {store.regions.map(region => (
              <Select.Option key={region.name} value={region.name}>{region.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
          <Select value={local.data.source_type} onChange={value => {
            local.data.source_type = value
          }}>
            {store.resource_types.map(type => (
              <Select.Option key={type.name} value={type.name}>{type.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="分类" labelCol={lb} wrapperCol={rb}>
          {local.data.types.map((type, index) => <Tag key={index} closable onClose={() => { local.data.types.filter(t => t !== type) }}>{type}</Tag>)}
          {local.typeAddVisible && (
            <Input
              ref={inputType}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={local.tempTypes}
              autoFocus
              onChange={e => local.tempTypes = e.target.value}
              onBlur={() => {
                let type = local.tempTypes.trim()
                const types = local.data.types
                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                  local.data.types.push(type)
                }
                local.typeAddVisible = false
                local.tempTypes = ''
              }}
              onPressEnter={() => {
                let type = local.tempTypes.trim()
                const types = local.data.types
                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                  local.data.types.push(type)
                }
                local.typeAddVisible = false
                local.tempTypes = ''
              }}
            />
          )}
          {!local.typeAddVisible && (
            <Tag onClick={() => local.typeAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" />
            </Tag>
          )}
        </Form.Item>
        <Form.Item label="标签" labelCol={lb} wrapperCol={rb}>
          {local.data.tags.map((tag, index) => <Tag key={index} closable onClose={() => { local.data.tags.filter(t => t !== tag) }}>{tag}</Tag>)}
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
                let tag = local.tempTag.trim()
                const tags = local.data.tags
                if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                  local.data.tags.push(tag)
                }
                local.tagAddVisible = false
                local.tempTag = ''
              }}
              onPressEnter={() => {
                let tag = local.tempTag.trim()
                const tags = local.data.tags
                if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                  local.data.tags.push(tag)
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
        <Form.Item label="封面" labelCol={lb} wrapperCol={rb}>
          <Upload
            style={{ position: 'relative' }}
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false} ref={picture} name="poster" onChange={e => {
              local.data.poster = e.file
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                local.tempImg = reader.result
              });
              reader.readAsDataURL(e.file);
            }} beforeUpload={(f) => {
              return false
            }}>
            <img width="100%" src={local.tempImg || (store.app.imageLine + (local.data.poster || local.data.thumbnail || '/images/poster/nocover.jpg'))} alt="" />
            {local.data.poster === '' && (
              <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <Icon type="arrow-up-line" /> 编辑
                            </Button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="附件列表" labelCol={lb} wrapperCol={rb}>
          <SortListView
            isLoading={local.loading}
            direction="vertical"
            mode="edit"
            handler={<Icon type="drag" style={{ marginRight: 10 }} />}
            sort={async (oldIndex, newIndex) => {
              const data = local.data.urls.map(item => ({ id: item.id, url: item.url }))
              const id = data.splice(oldIndex, 1)
              data.splice(newIndex, 0, ...id)
              data.forEach((d, i) => {
                d.nth = i + 1
              })
              local.loading = false
              try {
                await api.sortResourceVideo({ id: local.id, data })
                const items = local.data.urls.map(item => item)
                const item = items.splice(oldIndex, 1);
                items.splice(newIndex, 0, ...item)
                local.data.urls = items
              } finally {
                local.loading = false
              }
            }}
            items={local.data.urls}
            droppableId={local.id}
            listStyle={{ boxSizing: 'border-box' }}
            itemStyle={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}
            renderItem={({ item, index }) => (
              <Input
                key={index}
                value={item.nth + ' ' + item.url}
                disabled
                addonBefore={<Observer>{() => (
                  <Fragment>
                    <Select style={{ width: 90 }} value={item.status} onChange={async (status) => {
                      item.loading = true
                      try {
                        await api.updateResourceVideo(local.id, { id: item.id, status })
                        item.status = status
                      } finally {
                        item.loading = false
                      }
                    }}>
                      <Select.Option value="init">初始化</Select.Option>
                      <Select.Option value="loading">下载中</Select.Option>
                      <Select.Option value="finished">已下载</Select.Option>
                      <Select.Option value="fail">失败</Select.Option>
                    </Select>
                    <Divider type="vertical" />
                    <Select style={{ width: 80 }} value={item.type} onChange={async (type) => {
                      item.loading = true
                      try {
                        await api.updateResourceVideo(local.id, { id: item.id, type })
                        item.type = type
                      } finally {
                        item.loading = false
                      }
                    }}>
                      <Select.Option value="normal">正片</Select.Option>
                      <Select.Option value="trailer">预告</Select.Option>
                      <Select.Option value="tidbits">花絮</Select.Option>
                    </Select>
                  </Fragment>
                )}</Observer>}
                suffix={<CloseOutlined disabled={item.loading || item.status === 'loading'} onClick={async () => {
                  item.loading = true
                  try {
                    await api.removeResourceVideo({ id: item.id, mid: local.id })
                    local.data.urls = local.data.urls.filter(t => t.url !== item.url)
                  } finally {
                    item.loading = false
                  }
                }} />}
                addonAfter={<Observer>{() => (
                  <Icon type={item.loading || item.status === 'loading' ? 'loading' : 'download'} disabled={item.loading} onClick={async () => {
                    item.loading = true
                    try {
                      await api.downloadResourceVideo(local.id, item.id)
                      item.status = 'loading'
                    } finally {
                      item.loading = false
                    }
                  }} />
                )}</Observer>}
              />
            )}
          />
          {local.urlAddVisible && (
            <Input
              ref={inputUrl}
              type="text"
              size="small"
              style={{ margin: '10px 5px' }}
              value={local.tempUrl}
              autoFocus
              disabled={local.isDealUrl}
              onChange={e => local.tempUrl = e.target.value}
              addonBefore={<Fragment>
                <Select style={{ width: 90 }} disabled={local.isDealUrl} value={local.tempStatus} onChange={async (status) => {
                  local.tempStatus = status;
                }}>
                  <Select.Option value="init">初始化</Select.Option>
                  <Select.Option value="loading">下载中</Select.Option>
                  <Select.Option value="finished">已下载</Select.Option>
                  <Select.Option value="fail">失败</Select.Option>
                </Select>
                <Divider type="vertical" />
                <Select style={{ width: 80 }} disabled={local.isDealUrl} value={local.tempType} onChange={async (type) => {
                  local.tempType = type;
                }}>
                  <Select.Option value="normal">正片</Select.Option>
                  <Select.Option value="trailer">预告</Select.Option>
                  <Select.Option value="tidbits">花絮</Select.Option>
                </Select>
              </Fragment>}
              addonAfter={<Icon type="check" onClick={async () => {
                if (local.isDealUrl) {
                  return;
                }
                let url = local.tempUrl.trim()
                if ('' === url) {
                  local.urlAddVisible = false
                  return;
                }
                if (-1 !== local.data.urls.findIndex(t => t.url === url)) {
                  return notification.info('exists')
                }
                local.isDealUrl = true
                try {
                  const res = await api.addResourceVideo({ id: local.id, title: local.data.title, url, type: local.tempType, status: local.tempStatus })
                  if (res && res.code === 0) {
                    local.data.urls.push({ url: res.data.url, id: res.data.id, status: local.tempStatus, type: local.tempType, nth: local.data.urls.length })
                    local.urlAddVisible = false
                  } else {
                    notification.info('fail')
                  }
                } finally {
                  local.tempUrl = '';
                  local.isDealUrl = false;
                  local.tempStatus = 'init';
                  local.tempType = 'normal';
                }
              }} />}
            />
          )}
          {!local.urlAddVisible && (
            <Tag onClick={() => local.urlAddVisible = true} style={{ margin: '10px 5px', background: '#fff', borderStyle: 'dashed' }}>
              <PlusCircleOutlined />
            </Tag>
          )}
        </Form.Item>
      </div>
      <Form.Item label="" style={{ textAlign: 'center', backgroundColor: '#b5cbde', height: 50, lineHeight: '50px', margin: 0, }}>
        <Button loading={local.loading} disabled={local.loading} type="primary" onClick={onEdit}>保存</Button>
      </Form.Item>
    </div>
  </Fragment>)}</Observer>
}