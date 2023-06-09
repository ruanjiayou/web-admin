import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import Ueditor from '../../../component/Ueditor'
import apis from '../../../api'
import { Button, notification, Input, Form, Tag, Upload, Select, Divider, } from 'antd';
import Icon from '../../../component/Icon'
import qs from 'qs'
import * as _ from 'lodash'
import { toJS } from 'mobx';
import store from '../../../store'

export default function ResourceEdit() {
  const ueditor = useRef(null)
  const picture = useRef(null)
  const inp = useRef(null)
  const inputType = useRef(null)
  const lb = { span: 3 }, rb = { span: 18 }
  const query = qs.parse(window.location.search.substr(1))
  const local = useLocalStore(() => ({
    data: {},
    initData() {
      this.data = {
        id: query.id || '',
        title: '',
        alias: '',
        poster: '',
        desc: '',
        content: '',
        publishedAt: new Date().toISOString(),
        source_id: '',
        source_type: 'article',
        source_name: '',
        types: [],
        tags: [],
        series: '',
        origin: '',
        // words: 0,
        open: true,
      }
    },
    // 临时
    tempImg: '',
    tempTag: '',
    tagAddVisible: false,
    tempType: '',
    typeAddVisible: false,
    loading: false,
    // 
    fetching: false,
  }));
  local.initData();
  const edit = useCallback(() => {
    if (ueditor.current) {
      const content = decodeURIComponent(ueditor.current.getUEContent().replace(/%/g, '%25'))
      const data = toJS(local.data);
      data.content = content
      data.publishedAt = new Date(local.data.publishedAt)
      const api = data.id ? apis.updateResource : apis.createResource
      api(data).then(res => {
        if (res.code === 0) {
          notification.info({ message: '操作成功' })
          local.initData();
          window.editor.setContent('')
        } else {
          notification.error({ message: '操作失败' })
        }
      })
    } else {
      notification.error({ message: '获取ueditor失败' })
    }
  }, [])
  const crawler = useCallback(async () => {
    local.data.fetching = true
    try {
      const result = await apis.fetchCrawler({ data: { origin: local.data.origin } });
      if (result.code === 0) {
        local.data.title = result.data.title
        local.data.author = result.data.author
        local.data.publishedAt = result.data.publishedAt
        local.data.content = result.data.content
        window.editor.setContent(local.data.content)
      }
    } finally {
      local.data.fetching = false
    }

  }, [])
  useEffect(() => {
    if (local.data.id) {
      local.data.fetching = true
      apis.getResource({ id: local.data.id }).then(res => {
        if (res && res.status === 'success' && res.code === 0) {
          const data = res.data
          local.data = data;
          local.tempImg = data.poster
          window.editor && window.editor.ready(() => window.editor.setContent(local.data.content))
        } else {
          notification.error({ message: '请求失败' })
        }
        local.data.fetching = false
      })
    }
  })

  return <Observer>{() => (<Fragment>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Form.Item label="标题" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} />
        </Form.Item>
        <Form.Item label="发布时间" labelCol={lb} wrapperCol={rb}>
          <Input
            addonAfter={<Icon type="sync-horizon" onClick={() => {
              local.data.publishedAt = new Date().toISOString();
            }} />}
            style={{ width: '50%' }}
            value={local.data.publishedAt}
            onChange={e => local.data.publishedAt = e.target.value}
          />
        </Form.Item>
        <Form.Item label="来源" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.origin} onChange={e => local.data.origin = e.target.value} />
          <Divider type="vertical" />
          <Button type="primary" loading={local.data.fetching} onClick={crawler}>抓取</Button>
        </Form.Item>
        <Form.Item label="系列" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.series} onChange={e => local.data.series = e.target.value} />
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
        <Form.Item label="国家地区" labelCol={lb} wrapperCol={rb}>
          <Select value={local.data.country} onChange={value => {
            local.data.country = value
          }}>
            {store.regions.map(region => (
              <Select.Option key={region.name} value={region.name}>{region.title}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="分类" labelCol={lb} wrapperCol={rb}>
          {local.data.types.map((type, index) => <Tag key={index} closable onClose={() => { local.data.types.filter(t => t !== type) }}>{type}</Tag>)}
          {local.data.typeAddVisible && (
            <Input
              ref={inputType}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={local.tempType}
              autoFocus
              onChange={e => local.tempType = e.target.value}
              onBlur={() => {
                let type = local.tempType.trim()
                const types = local.data.types
                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                  local.data.types.push(type)
                }
                local.data.typeAddVisible = false
                local.tempType = ''
              }}
              onPressEnter={() => {
                let type = local.tempType.trim()
                const types = local.data.types
                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                  local.data.types.push(type)
                }
                local.data.typeAddVisible = false
                local.tempType = ''
              }}
            />
          )}
          {!local.data.typeAddVisible && (
            <Tag onClick={() => local.data.typeAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" />
            </Tag>
          )}
        </Form.Item>
        <Form.Item label="标签" labelCol={lb} wrapperCol={rb}>
          {local.data.tags.map((tag, index) => <Tag key={index} closable onClose={() => { local.data.tags.filter(t => t !== tag) }}>{tag}</Tag>)}
          {local.data.tagAddVisible && (
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
                local.data.tagAddVisible = false
                local.tempTag = ''
              }}
              onPressEnter={() => {
                let tag = local.tempTag.trim()
                const tags = local.data.tags
                if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                  local.data.tags.push(tag)
                }
                local.data.tagAddVisible = false
                local.tempTag = ''
              }}
            />
          )}
          {!local.data.tagAddVisible && (
            <Tag onClick={() => local.data.tagAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
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
            <img width="100%" src={local.tempImg} alt="" />
            {local.data.poster === '' && (
              <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <Icon type="arrow-up-line" /> 编辑
              </Button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="内容" labelCol={lb} wrapperCol={rb}>
          <div style={{ lineHeight: 'initial', height: '100%' }}>
            <Ueditor ref={ref => ueditor.current = ref} initData={local.data.content} />
          </div>
        </Form.Item>
      </div>
      <Form.Item label="" style={{ textAlign: 'center', backgroundColor: '#b5cbde', height: 50, lineHeight: '50px', margin: 0, }}>
        <Button loading={local.data.fetching} disabled={local.data.fetching} type="primary" onClick={edit}>保存</Button>
      </Form.Item>
    </div>
  </Fragment>)}</Observer>
}