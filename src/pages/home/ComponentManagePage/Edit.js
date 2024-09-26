import { cloneDeep } from 'lodash'
import React, { useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Modal, Radio, Form, Input, Select, Upload, Button, } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { useStore } from '../../../contexts'

export default function Editor({ data, cancel, save }) {
  const lb = { span: 6 }, rb = { span: 18 }
  const store = useStore()
  const picture = useRef(null)
  const local = useLocalStore(() => ({
    data: data.id ? cloneDeep(data) : {},
    loading: false,
    image: data.image || '',
    ref: '',
    maps: [],
  }))
  return <Observer>{() => (
    <Modal
      title={data.id ? '修改' : '添加'}
      visible={true}
      okText="确定"
      cancelText="取消"
      onOk={async () => {
        try {
          local.loading = true
          const success = await save(local.data)
          if (success) {
            cancel()
          }
        } catch (e) {

        } finally {
          local.loading = false
        }
      }}
      onCancel={() => {
        cancel()
      }}
    >
      <Form>
        <Form.Item label="名称" labelCol={lb} wrapperCol={rb}>
          <Input value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} />
        </Form.Item>
        <Form.Item label="类型名称" labelCol={lb} wrapperCol={rb}>
          <Input value={local.data.name} onChange={e => local.data.name = e.target.value} />
        </Form.Item>
        <Form.Item label="image" labelCol={lb} wrapperCol={rb}>
          <Upload
            style={{ position: 'relative' }}
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false} ref={picture} name="image" onChange={e => {
              local.data.image = e.file
              const reader = new FileReader();
              reader.addEventListener('load', () => { local.image = reader.result });
              reader.readAsDataURL(e.file);
            }} beforeUpload={(f) => {
              return false
            }}>
            <img width="100%" src={(local.image.startsWith('data') ? local.image : store.app.imageLine + (local.image || '/images/poster/nocover.jpg'))} alt="" />
            <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
              <UploadOutlined /> 上传
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item label="分类类型" labelCol={lb} wrapperCol={rb}>
          <Input value={local.data.type} onChange={e => local.data.type = e.target.value} />
        </Form.Item>
        <Form.Item label="描述" labelCol={lb} wrapperCol={rb}>
          <Input value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
        </Form.Item>
        <Form.Item label='状态' labelCol={lb} wrapperCol={rb}>
          <Radio.Group
            value={local.data.status}
            options={[{ label: '显示', value: 1 }, { label: '隐藏', value: 0 }]}
            onChange={e => local.data.enable = e.target.value}
          />
        </Form.Item>
      </Form>
    </Modal>
  )}</Observer>
}
