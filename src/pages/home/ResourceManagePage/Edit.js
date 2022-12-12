import _ from 'lodash'
import React, { Fragment, useRef } from 'react'
import { Modal, Form, Input, notification, Select, Upload, Button, Switch, Tag } from 'antd'
import { Observer, useLocalStore } from 'mobx-react-lite';
import { UploadOutlined, PlusCircleOutlined } from '@ant-design/icons'
import store from '../../../store'
import { VisualBox } from '../../../component'

export default function ResourceEdit({ data, cancel, save, }) {
  const lb = { span: 3 }, rb = { span: 18 }
  const local = useLocalStore(() => ({
    data: data.id ? _.cloneDeep(data) : { tags: [], types: [], poster: '', urls: [], open: false, status: 'finished' },
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
  const inp = useRef(null)
  const inputType = useRef(null)
  const file = useRef(null)
  const picture = useRef(null)
  return <Observer>{() => (
    <Fragment>
      <Modal
        style={{ overflow: 'auto', padding: 0 }}
        width={700}
        bodyStyle={{ height: 500, overflow: 'auto' }}
        title={local.data.id ? '编辑组件' : '添加组件'}
        visible={true}
        onCancel={cancel}
        onOk={async () => {
          if (local.loading) {
            return;
          }
          local.loading = true;
          const result = await save(local.data)
          local.loading = false
          if (result) {
            cancel()
          } else {
            console.log(result)
            notification.info({ message: '操作失败' })
          }
        }}
      >
        <Form>
          <Form.Item label="标题" labelCol={lb} wrapperCol={rb}>
            <Input value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} />
          </Form.Item>
          <Form.Item label="封面" labelCol={lb} wrapperCol={rb}>
            <Input value={local.data.poster} onChange={e => local.data.poster = e.target.value} />
          </Form.Item>
          <Form.Item label="描述" labelCol={lb} wrapperCol={rb}>
            <Input.TextArea rows={4} value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
          </Form.Item>
          <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
            <Select value={local.data.source_type || ''} onChange={value => {
              local.data.source_type = value
              local.data.type = ""
            }}>
              {store.resource_types.map(type => <Select.Option value={type.name} key={type.name}>{type.title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="系列" labelCol={lb} wrapperCol={rb}>
            <Input value={local.data.series} onChange={e => local.data.series = e.target.value} />
          </Form.Item>
          <Form.Item label="types" labelCol={lb} wrapperCol={rb}>
            {local.data.types.map((type, index) => <Tag key={index} closable onClose={() => { local.data.types.filter(t => t !== type) }}>{type}</Tag>)}
            {local.typeAddVisible && (
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
                  const types = local.data.types.toJSON()
                  if (type !== '' && -1 === types.findIndex(t => t === type)) {
                    local.data.types.push(type)
                  }
                  local.typeAddVisible = false
                  local.tempType = ''
                }}
                onPressEnter={() => {
                  let type = local.tempType.trim()
                  const types = local.data.types.toJSON()
                  if (type !== '' && -1 === types.findIndex(t => t === type)) {
                    local.data.types.push(type)
                  }
                  local.typeAddVisible = false
                  local.tempType = ''
                }}
              />
            )}
            {!local.typeAddVisible && (
              <Tag onClick={() => local.typeAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
                <PlusCircleOutlined />
              </Tag>
            )}
          </Form.Item>
          <Form.Item label="tags" labelCol={lb} wrapperCol={rb}>
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
                  let tagArr = local.tempTag.trim().replace(/,/g, ' ').split(' ');
                  const tags = local.data.tags.toJSON()
                  for (let i = 0; i < tagArr.length; i++) {
                    const tag = tagArr[i];
                    if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                      local.data.tags.push(tag)
                    }
                  }
                  local.tagAddVisible = false
                  local.tempTag = ''
                }}
                onPressEnter={() => {
                  let tagArr = local.tempTag.trim().replace(/,/g, ' ').split(' ');
                  const tags = local.data.tags.toJSON()
                  for (let i = 0; i < tagArr.length; i++) {
                    const tag = tagArr[i];
                    if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                      local.data.tags.push(tag)
                    }
                  }
                  local.tagAddVisible = false
                  local.tempTag = ''
                }}
              />
            )}
            {!local.tagAddVisible && (
              <Tag onClick={() => local.tagAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
                <PlusCircleOutlined />
              </Tag>
            )}
          </Form.Item>
          <Form.Item label="country" labelCol={lb} wrapperCol={rb}>
            <Select value={local.data.country || ''} onChange={value => local.data.country = value}>
              {store.regions.map(city => <Select.Option value={city.name} key={city.name}>{city.title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="open" labelCol={lb} wrapperCol={rb}>
            <Switch checked={local.data.open} onClick={e => {
              local.data.open = !local.data.open
            }} /> {local.data.open}
          </Form.Item>
          <Form.Item label="status" labelCol={lb} wrapperCol={rb}>
            <Switch checked={local.data.status === 'finished'} onClick={e => {
              local.data.status = local.data.status === 'finished' ? 'loading' : 'finished'
            }} /> {local.data.status}
          </Form.Item>
          <Form.Item label="poster" labelCol={lb} wrapperCol={rb}>
            <Upload
              style={{ position: 'relative' }}
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false} ref={picture} name="poster" onChange={e => {
                local.data.poster = e.file
                const reader = new FileReader();
                reader.addEventListener('load', () => { local.poster = reader.result });
                reader.readAsDataURL(e.file);
              }} beforeUpload={(f) => {
                return false
              }}>
              <img width="100%" src={(local.poster.startsWith('data') ? local.poster : store.app.imageLine + (local.data.poster || '/images/poster/nocover.jpg'))} alt="" />
              <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <UploadOutlined /> 上传
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item label="资源" labelCol={lb} wrapperCol={rb}>
            <Upload ref={file} name="file" onChange={e => {
              local.data.file = e.file
            }} beforeUpload={(f) => {
              return false
            }}>
              <Button>
                <UploadOutlined /> 上传
              </Button>
            </Upload>
          </Form.Item>
          <VisualBox visible={local.data.source_type === 'video' && !local.data.id}>
            <Form.Item label="urls" labelCol={lb} wrapperCol={rb}>
              {local.data.urls && local.data.urls.map((url, index) => <div key={index}><Tag closable onClose={() => { local.data.urls = local.data.urls.filter(t => t !== url) }}>{url}</Tag></div>)}
              {local.urlAddVisible && (
                <Input
                  ref={inputType}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={local.tempUrl}
                  autoFocus
                  onChange={e => local.tempUrl = e.target.value}
                  onBlur={() => {
                    let url = local.tempUrl.trim()
                    const urls = local.data.urls
                    if (url !== '' && -1 === urls.findIndex(t => t === url)) {
                      local.data.urls.push(url)
                    }
                    local.urlAddVisible = false
                    local.tempUrl = ''
                  }}
                  onPressEnter={() => {
                    let url = local.tempUrl.trim()
                    const urls = local.data.urls
                    if (url !== '' && -1 === urls.findIndex(t => t === url)) {
                      local.data.urls.push(url)
                    }
                    local.urlAddVisible = false
                    local.tempUrl = ''
                  }}
                />
              )}
              {!local.urlAddVisible && (
                <Tag onClick={() => local.urlAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  <PlusCircleOutlined />
                </Tag>
              )}
            </Form.Item>
          </VisualBox>
        </Form>
      </Modal>
    </Fragment>
  )}</Observer>
}
