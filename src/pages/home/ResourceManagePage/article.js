import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import Ueditor from '../../../component/Ueditor'
import apis from '../../../api'
import { Button, notification, Input, Form, Radio, Tag, Upload, Select } from 'antd';
import Icon from '../../../component/Icon'
import qs from 'qs'
import * as _ from 'lodash'

export default function ResourceEdit() {
  const ueditor = useRef(null)
  const picture = useRef(null)
  const inp = useRef(null)
  const lb = { span: 3 }, rb = { span: 18 }
  const query = qs.parse(window.location.search.substr(1))
  const store = useLocalStore(() => ({
    id: query.id || '',
    title: '',
    poster: '',
    content: '',
    createdAt: new Date().toISOString(),
    source_type: 'article',
    type: '',
    origin: '',
    // words: 0,
    open: true,
    tags: [],
    // 临时
    tempImg: '',
    tempTag: '',
    tagAddVisible: false,
    loading: false,
    categories: {},
  }))
  const edit = useCallback(() => {
    if (ueditor.current) {
      const content = decodeURIComponent(ueditor.current.getUEContent().replace(/%[^2]/g, '%25'))
      const data = _.pick(store, ['id', 'title', 'poster', 'source_type', 'type', 'origin', 'open', 'tags'])
      data.content = content
      data.createdAt = new Date(store.createdAt)
      const api = data.id ? apis.updateResource : apis.createResource
      store.loading = true
      api(data).then(res => {
        if (res.code === 0) {
          notification.info({ message: '操作成功' })
        } else {
          notification.error({ message: '操作失败' })
        }
        store.loading = false
      })
    } else {
      notification.error({ message: '获取ueditor失败' })
    }
  })
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
          store.type = data.type
          store.origin = data.origin
          //
          store.tempImg = data.poster
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
          <Input style={{ width: '50%' }} value={store.origin} autoFocus onChange={e => store.origin = e.target.value} />
        </Form.Item>
        <Form.Item label="时间" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={store.createdAt} autoFocus onChange={e => store.createdAt = e.target.value} />
        </Form.Item>
        <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
          <Select value={store.source_type} onChange={value => {
            store.source_type = value
          }}>
            <Select.Option value="article">文章</Select.Option>
            <Select.Option value="news">资讯</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="type" labelCol={lb} wrapperCol={rb}>
          <Select value={store.type} onChange={v => {
            store.type = v
          }}>
            {(store.categories[store.source_type] || []).map(it => <Select.Option key={it.id} value={it.name === '全部' ? '' : it.name}>{it.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label='开放' labelCol={lb} wrapperCol={rb}>
          <Radio.Group
            value={store.open}
            options={[{ label: '显示', value: true }, { label: '隐藏', value: false }]}
            onChange={e => store.open = e.target.value}
          />
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
            <img width="100%" src={store.tempImg} />
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
      <Form.Item label="" style={{ marginLeft: '12.5%' }} labelCol={lb} wrapperCol={rb}>
        <Button loading={store.loading} disabled={store.loading} type="primary" onClick={() => {
          edit()
        }}>保存</Button>
      </Form.Item>
    </div>
  </Fragment>)}</Observer>
}