import _ from 'lodash'
import React, { Fragment, useRef } from 'react'
import { Modal, Form, Input, notification, Select, Upload, Button, Switch, Tag } from 'antd'
import { Observer, useLocalStore } from 'mobx-react-lite';
import { UploadOutlined, PlusCircleOutlined } from '@ant-design/icons'

export default function ResourceEdit({ data, cancel, save, }) {
  const lb = { span: 3 }, rb = { span: 18 }
  const local = useLocalStore(() => ({
    data: data.id ? _.cloneDeep(data) : { tags: [] },
    loading: false,
    ref: '',
    poster: data.poster || 'http://localhost:8097/poster/nocover.jpg',
    maps: [],
    tagAddVisible: false,
    tempTag: '',
  }))
  const inp = useRef(null)
  const file = useRef(null)
  const picture = useRef(null)
  return <Observer>{() => (
    <Fragment>
      <Modal
        style={{ overflow: 'auto', padding: 0 }}
        width={1000}
        bodyStyle={{ height: 700, overflow: 'auto' }}
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
          <Form.Item label="描述" labelCol={lb} wrapperCol={rb}>
            <Input.TextArea rows={4} value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
          </Form.Item>
          <Form.Item label="类别" labelCol={lb} wrapperCol={rb}>
            {/* <Select value={local.data.type} onChange={e => local.data.type = e.target.value}>
              <Select.Option value="">请选择</Select.Option>
              {catas.map(cata => (<Select.Option value={cata.name}>{cata.title}</Select.Option>))}
            </Select> */}
            <Input value={local.data.type} autoFocus onChange={e => local.data.type = e.target.value} />
          </Form.Item>
          <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
            <Select value={local.data.source_type} onChange={value => {
              local.data.source_type = value
              local.data.type = ""
              // TODO: 需要model才能 getSnapShot
            }}>
              <Select.Option value="">请选择</Select.Option>
              <Select.Option value="image">图片</Select.Option>
              <Select.Option value="animation">动漫</Select.Option>
              <Select.Option value="music">音频</Select.Option>
              <Select.Option value="video">视频</Select.Option>
              <Select.Option value="novel">小说</Select.Option>
              <Select.Option value="article">文章</Select.Option>
              <Select.Option value="news">资讯</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="country" labelCol={lb} wrapperCol={rb}>
            <Select value={local.data.country} onChange={value => local.data.country = value}>
              <Select.Option value="">请选择</Select.Option>
              <Select.Option value="China">中国</Select.Option>
              <Select.Option value="English">英国</Select.Option>
              <Select.Option value="Japan">日本</Select.Option>
              <Select.Option value="Korea">韩国</Select.Option>
            </Select>
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
                  let tag = local.tempTag.trim()
                  const tags = local.data.tags.toJSON()
                  if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                    local.data.tags.push(tag)
                  }
                  local.tagAddVisible = false
                  local.tempTag = ''
                }}
                onPressEnter={() => {
                  let tag = local.tempTag.trim()
                  const tags = local.data.tags.toJSON()
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
                <PlusCircleOutlined />
              </Tag>
            )}
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
              <img width="100%" src={local.poster} alt=""/>
              <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <UploadOutlined /> 上传
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item label="上传" labelCol={lb} wrapperCol={rb}>
            <Upload ref={file} name="music" onChange={e => {
              local.data.music = e.file
            }} beforeUpload={(f) => {
              return false
            }}>
              <Button>
                <UploadOutlined /> 上传
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )}</Observer>
}
