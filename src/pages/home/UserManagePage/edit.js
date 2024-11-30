import React, { useRef, useState } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Modal, Form, Input, Upload, Select } from 'antd';
import { useEffectOnce } from 'react-use';
import apis from '../../../api';
import { CenterXY } from '../../../component/style';

const lb = { span: 4, offset: 3 }, rb = { span: 12 }
export default function ({ data, save, cancel }) {
  const local = useLocalStore(() => ({
    data: data,
    isLoading: false,
    spiders: [],
  }))
  const picture = useRef(null)
  useEffectOnce(() => {
    apis.getSpiders().then(resp => {
      if (resp.code === 0) {
        local.spiders = resp.data;
      }
    })
  })
  return <Observer>{() => <Modal
    open={true}
    style={{ overflow: 'auto', padding: 0 }}
    width={600}
    title={local.data._id ? '修改用户' : '添加用户'}
    onCancel={e => { cancel() }}
    onOk={async () => {
      local.isLoading = true
      await save(local.data);
      cancel()
    }}
  >
    <Form>
      <Form.Item style={{ marginBottom: 5 }} label="昵称" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="昵称" value={local.data.nickname} onChange={e => local.data.nickname = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="头像" labelCol={lb} wrapperCol={rb}>
        <Upload
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false} ref={picture} name="avaar"
          onChange={e => {
            local.data.avatar = e.file
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              local.tempImg = reader.result
            });
            reader.readAsDataURL(e.file);
          }} beforeUpload={() => {
            return false
          }}>
          <CenterXY style={{ height: '100%', overflow: 'hidden' }}>
            <img width="100%" src={local.tempImg} alt="" />
          </CenterXY>
        </Upload>
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="账号" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="账号" value={local.data.account} onChange={e => local.data.account = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="规则" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="规则" readOnly value={local.data.spider_id} onChange={e => local.data.spider_id = e.target.value} addonAfter={
          <Observer>{() => (
            <Select
              style={{ width: 100 }}
              defaultValue={local.data.spider_id}
              onChange={v => {
                local.data.spider_id = v;
              }}
            >
              <Select.Option value={''} key={'none'}>无</Select.Option>
              {local.spiders.map(spider => (
                <Select.Option value={spider._id} key={spider._id}>{spider.name}</Select.Option>
              ))}
            </Select>
          )}</Observer>
        } />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="源id" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="源id" value={local.data.source_id} onChange={e => local.data.source_id = e.target.value} />
      </Form.Item>
    </Form>
  </Modal>}</Observer>
}