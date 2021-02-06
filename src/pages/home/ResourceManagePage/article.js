import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import Ueditor from '../../../component/Ueditor'
import apis from '../../../api'
import { Button, notification, Input, Form, Radio, Tag, Upload, Select, Divider } from 'antd';
import Icon from '../../../component/Icon'
import qs from 'qs'
import * as _ from 'lodash'

export default function ResourceEdit() {
  const ueditor = useRef(null)
  const picture = useRef(null)
  const inp = useRef(null)
  const inputType = useRef(null)
  const lb = { span: 3 }, rb = { span: 18 }
  const query = qs.parse(window.location.search.substr(1))
  const store = useLocalStore(() => ({
    id: query.id || '',
    title: '',
    poster: '',
    content: '',
    createdAt: new Date().toISOString(),
    source_type: 'article',
    types: [],
    series: '',
    origin: '',
    // words: 0,
    open: true,
    tags: [],
    // 临时
    tempImg: '',
    tempTag: '',
    tagAddVisible: false,
    tempType: '',
    typeAddVisible: false,
    loading: false,
    categories: {},
    // 
    fetching: false,
  }))
  const edit = useCallback(() => {
    if (ueditor.current) {
      const content = decodeURIComponent(ueditor.current.getUEContent().replace(/%[^2]/g, '%25'))
      const data = _.pick(store, ['id', 'title', 'poster', 'source_type', 'types', 'origin', 'open', 'tags'])
      data.content = content
      data.createdAt = new Date(store.createdAt)
      const api = data.id ? apis.updateResource : apis.createResource
      store.loading = true
      api(data).then(res => {
        if (res.code === 0) {
          notification.info({ message: '操作成功' })
          store.title = ''
          store.author = ''
          store.content = ''
          store.createdAt = new Date().toISOString()
          window.editor.setContent('')
        } else {
          notification.error({ message: '操作失败' })
        }
        store.loading = false
      })
    } else {
      notification.error({ message: '获取ueditor失败' })
    }
  }, [])
  const crawler = useCallback(async () => {
    store.fetching = true
    try {
      const result = await apis.fetchCrawler({ data: { origin: store.origin } });
      if (result.code === 0) {
        store.title = result.data.title
        store.author = result.data.author
        store.createdAt = result.data.time
        store.content = result.data.content
        window.editor.setContent(store.content)
      }
    } finally {
      store.fetching = false
    }

  }, [])
  useEffect(() => {
    if (store.id) {
      store.loading = true
      apis.getResource({ id: store.id }).then(res => {
        if (res && res.status === 'success' && res.code === 0) {
          const data = res.data
          store.title = data.title
          store.content = data.content
          store.createdAt = data.createdAt
          store.tags = data.tags
          store.poster = data.poster
          store.open = data.open
          store.source_type = data.source_type
          store.types = data.types
          store.origin = data.origin
          //
          store.tempImg = data.poster
          window.editor && window.editor.ready(() => window.editor.setContent(store.content))
        } else {
          notification.error({ message: '请求失败' })
        }
        store.loading = false
      })
    }
  })

  useEffectOnce(() => {
    apis.getGroupTypes().then(result => {
      store.categories = result.data
    })
  }, [])
  return <Observer>{() => (<Fragment>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Form.Item label="标题" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={store.title} autoFocus onChange={e => store.title = e.target.value} />
        </Form.Item>
        <Form.Item label="来源" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={store.origin} onChange={e => store.origin = e.target.value} />
          <Divider type="vertical" />
          <Button type="primary" loading={store.fetching} onClick={crawler}>抓取</Button>
        </Form.Item>
        <Form.Item label="时间" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={store.createdAt} onChange={e => store.createdAt = e.target.value} />
        </Form.Item>
        <Form.Item label="系列" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={store.series} onChange={e => store.series = e.target.value} />
        </Form.Item>
        <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
          <Select value={store.source_type} onChange={value => {
            store.source_type = value
          }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="image">图片</Select.Option>
            <Select.Option value="animation">动漫</Select.Option>
            <Select.Option value="music">音频</Select.Option>
            <Select.Option value="video">视频</Select.Option>
            <Select.Option value="novel">小说</Select.Option>
            <Select.Option value="article">文章</Select.Option>
            <Select.Option value="news">资讯</Select.Option>
            <Select.Option value="private">私人</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="types" labelCol={lb} wrapperCol={rb}>
          {store.types.map((type, index) => <Tag key={index} closable onClose={() => { store.types.filter(t => t !== type) }}>{type}</Tag>)}
          {store.typeAddVisible && (
            <Input
              ref={inputType}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={store.tempType}
              autoFocus
              onChange={e => store.tempType = e.target.value}
              onBlur={() => {
                let type = store.tempType.trim()
                const types = store.types
                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                  store.types.push(type)
                }
                store.typeAddVisible = false
                store.tempType = ''
              }}
              onPressEnter={() => {
                let type = store.tempType.trim()
                const types = store.types
                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                  store.types.push(type)
                }
                store.typeAddVisible = false
                store.tempType = ''
              }}
            />
          )}
          {!store.typeAddVisible && (
            <Tag onClick={() => store.typeAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" />
            </Tag>
          )}
        </Form.Item>
        <Form.Item label="tags" labelCol={lb} wrapperCol={rb}>
          {store.tags.map((tag, index) => <Tag key={index} closable onClose={() => { store.tags.filter(t => t !== tag) }}>{tag}</Tag>)}
          {store.tagAddVisible && (
            <Input
              ref={inp}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={store.tempTag}
              autoFocus
              onChange={e => store.tempTag = e.target.value}
              onBlur={() => {
                let tag = store.tempTag.trim()
                const tags = store.tags
                if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                  store.tags.push(tag)
                }
                store.tagAddVisible = false
                store.tempTag = ''
              }}
              onPressEnter={() => {
                let tag = store.tempTag.trim()
                const tags = store.tags
                if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                  store.tags.push(tag)
                }
                store.tagAddVisible = false
                store.tempTag = ''
              }}
            />
          )}
          {!store.tagAddVisible && (
            <Tag onClick={() => store.tagAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
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
              store.poster = e.file
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                store.tempImg = reader.result
              });
              reader.readAsDataURL(e.file);
            }} beforeUpload={(f) => {
              return false
            }}>
            <img width="100%" src={store.tempImg} alt="" />
            {store.poster === '' && (
              <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <Icon type="arrow-up-line" /> 编辑
              </Button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="内容" labelCol={lb} wrapperCol={rb}>
          <div style={{ lineHeight: 'initial', height: '100%' }}>
            <Ueditor ref={ref => ueditor.current = ref} initData={store.content} />
          </div>
        </Form.Item>
      </div>
      <Form.Item label="" style={{ textAlign: 'center', backgroundColor: '#b5cbde', height: 50, lineHeight: '50px', margin: 0, }}>
        <Button loading={store.loading} disabled={store.loading} type="primary" onClick={edit}>保存</Button>
      </Form.Item>
    </div>
  </Fragment>)}</Observer>
}