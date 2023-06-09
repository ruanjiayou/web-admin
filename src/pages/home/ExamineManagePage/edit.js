import React, { useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, Modal, Form, Input, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import store from '../../../store';
import { Icon } from '../../../component'

const lb = { span: 6, offset: 3 }, rb = { span: 12 }
export default function ({ data, save, cancel }) {
  const local = useLocalStore(() => ({
    data: data,
    image: data.image ? store.app.imageLine + data.image : '',
    isLoading: false,
  }))
  const picture = useRef(null)
  const iref = useRef(null)
  return <Observer>{() => <Modal
    visible={true}
    style={{ overflow: 'auto', padding: 0 }}
    width={600}
    title={local.inster ? '添加' : '修改'}
    onCancel={e => { cancel() }}
    onOk={async () => {
      local.isLoading = true
      await save(local.data);
      cancel()
    }}
  >
    <Form>
      <Form.Item style={{ marginBottom: 5 }} label="名称" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="名称" value={local.data.title} onChange={e => local.data.title = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="描述" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="描述" value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="状态" labelCol={lb} wrapperCol={rb}>
        <Select value={local.data.status} onChange={value => local.data.status = value}>
          <Select.Option value={1}>未完成</Select.Option>
          <Select.Option value={2}>未开卷</Select.Option>
          <Select.Option value={3}>使用中</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label='分组列表' labelCol={lb} wrapperCol={rb}>
        {(local.data.group || []).map((item, index) => <Input value={item.title} disabled key={index} onChange={e => {
          local.data.group[index].title = e.target.value
        }} addonAfter={<Icon type="delete" onClick={e => {
          local.data.group.splice(index, 1)
        }} />} />)}
        <Input
          ref={iref}
          addonAfter={<Icon type="circle-plus" onClick={() => {
            let max = 0
            local.data.group.forEach(it => {
              max = it.index > max ? it.index : max
            })
            local.data.group.push({ index: max + 1, title: iref.current.state.value })
            iref.current.state.value = ''
            iref.current.focus()
          }} />}
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="图片" labelCol={lb} wrapperCol={rb}>
        <Upload
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false} ref={picture} name="poster" onChange={e => {
            local.data.image = e.file
            const reader = new FileReader();
            reader.addEventListener('load', () => { local.image = reader.result });
            reader.readAsDataURL(e.file);
          }} beforeUpload={(f) => {
            return false
          }}>
          <img width="100%" src={local.image} alt="" />
          <Button style={{}}>
            <UploadOutlined /> 上传
          </Button>
        </Upload>
      </Form.Item>
    </Form>
  </Modal>
  }</Observer >
}