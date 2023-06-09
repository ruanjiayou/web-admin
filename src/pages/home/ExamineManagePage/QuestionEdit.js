import React, { useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, Modal, Form, Input, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import store from '../../../store';
import { Icon } from '../../../component'

const lb = { span: 6, offset: 3 }, rb = { span: 12 }
export default function ({ data, examine, save, cancel }) {
  const local = useLocalStore(() => ({
    data: data,
    image: data.image ? store.app.imageLine + data.image : '',
    answer: Object.keys(data.answer),
    isLoading: false,
  }));
  const picture = useRef(null)
  const iref = useRef(null)
  const iKeyRef = useRef(null)
  const iValueRef = useRef(null)
  return <Observer>{() => <Modal
    visible={true}
    style={{ overflow: 'auto', padding: 0 }}
    width={600}
    title={local.data.id ? '添加' : '修改'}
    onCancel={e => { cancel() }}
    onOk={async () => {
      local.isLoading = true
      await save(local.data);
      cancel()
    }}
  >
    <Form>
      <Form.Item style={{ marginBottom: 5 }} label="分组" labelCol={lb} wrapperCol={rb}>
        <Select value={local.data.groupId} onChange={value => local.data.groupId = value}>
          <Select.Option value={''}>无</Select.Option>
          {examine.group.map(group => (
            <Select.Option key={group.index} value={group.index}>{group.title}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="标题" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="标题" value={local.data.title} onChange={e => local.data.title = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="描述" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="描述" value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="参考" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="参考" value={local.data.reference} onChange={e => local.data.reference = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="类型" labelCol={lb} wrapperCol={rb}>
        <Select value={local.data.type} onChange={value => local.data.type = value}>
          <Select.Option value={'radio'}>单选</Select.Option>
          <Select.Option value={'multi'}>多选</Select.Option>
          <Select.Option value={'simple'}>简答</Select.Option>
          <Select.Option value={'boolean'}>判断</Select.Option>
        </Select>
      </Form.Item>
      {['radio', 'multi'].includes(local.data.type) && <Form.Item label='items' labelCol={lb} wrapperCol={rb}>
        {(local.data.items || []).map((item, index) => <Input
          value={item}
          disabled
          key={index}
          onChange={e => {
            local.data.items[index] = e.target.value
          }}
          addonBefore={Number(index + 10).toString(16)}
          addonAfter={<Icon type="delete" onClick={e => {
            local.data.items.splice(index, 1)
          }} />} />)}
        <Input
          ref={iref}
          addonAfter={<Icon type="circle-plus" onClick={() => {
            local.data.items.push(iref.current.state.value)
            iref.current.state.value = ''
            iref.current.focus()
          }} />}
        />
      </Form.Item>}
      <Form.Item label='答案' labelCol={lb} wrapperCol={rb}>
        {local.answer.map((k, i) => (
          <Input
            key={i}
            defaultValue={local.data.answer[k]}
            onChange={e => {
              local.data.answer[k] = e.target.value
            }}
            addonBefore={k}
            addonAfter={<Icon type="delete" onClick={() => {
              delete local.data.answer[k]
              local.answer.splice(i, 1)
            }} />} />
        ))}
        <Button.Group>
          <Input style={{ width: 80 }} ref={iKeyRef} />
          <Input ref={iValueRef} addonAfter={<Icon type="circle-plus" onClick={(e) => {
            if (iKeyRef.current && iValueRef) {
              const k = iKeyRef.current.state.value
              if (k.trim() === '') {
                message.error('key不能为空')
              } else {
                local.answer.push(k)
                local.data.answer[k] = iValueRef.current.state.value
                iKeyRef.current.state.value = ''
                iValueRef.current.state.value = ''
              }
            }
          }} />}
          />
        </Button.Group>
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