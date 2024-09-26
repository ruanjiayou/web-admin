import { cloneDeep } from 'lodash'
import React, { useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Modal, Radio, Form, Input, Select, Upload, Button, } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { useStore } from '../../../contexts'

export default function ChannelEditor({ data, cancel, save, groups }) {
  const lb = { span: 6 }, rb = { span: 18 }
  const store = useStore()
  const picture = useRef(null)
  const local = useLocalStore(() => ({
    data: data.id ? cloneDeep(data) : {},
    loading: false,
    cover: data.cover || '',
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
        <Form.Item label="标题" labelCol={lb} wrapperCol={rb}>
          <Input value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} />
        </Form.Item>
        <Form.Item label="cover" labelCol={lb} wrapperCol={rb}>
          <Upload
            style={{ position: 'relative' }}
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false} ref={picture} name="cover" onChange={e => {
              local.data.cover = e.file
              const reader = new FileReader();
              reader.addEventListener('load', () => { local.cover = reader.result });
              reader.readAsDataURL(e.file);
            }} beforeUpload={(f) => {
              return false
            }}>
            <img width="100%" src={(local.cover.startsWith('data') ? local.cover : store.app.imageLine + (local.cover || '/images/poster/nocover.jpg'))} alt="" />
            <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
              <UploadOutlined /> 上传
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item label="描述" labelCol={lb} wrapperCol={rb}>
          <Input value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
        </Form.Item>
        <Form.Item label="序号" labelCol={lb} wrapperCol={rb}>
          <Input value={local.data.order_index} type="number" onChange={e => local.data.order_index = e.target.value} />
        </Form.Item>
        <Form.Item label='开放' labelCol={lb} wrapperCol={rb}>
          <Radio.Group
            value={local.data.enable}
            options={[{ label: '显示', value: true }, { label: '隐藏', value: false }]}
            onChange={e => local.data.enable = e.target.value}
          />
        </Form.Item>
        <Form.Item label='是否首页' labelCol={lb} wrapperCol={rb}>
          <Radio.Group
            value={local.data.isRecommand}
            options={[{ label: '是', value: true }, { label: '否', value: false }]}
            onChange={e => local.data.isRecommand = e.target.value}
          />
        </Form.Item>
        <Form.Item label='是否频道' labelCol={lb} wrapperCol={rb}>
          <Radio.Group
            value={local.data.isChannel}
            options={[{ label: '是', value: true }, { label: '否', value: false }]}
            onChange={e => local.data.isChannel = e.target.value}
          />
        </Form.Item>
        <Form.Item label='group_id' labelCol={lb} wrapperCol={rb}>
          <Select value={local.data.group_id} onChange={value => local.data.group_id = value}>
            <Select.Option value="">无</Select.Option>
            {groups.map((m, index) => <Select.Option key={index} value={m.id}>{m.title}</Select.Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )}</Observer>
}
