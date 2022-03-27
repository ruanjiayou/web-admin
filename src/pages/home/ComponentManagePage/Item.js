import React from 'react'
import { Popconfirm, Divider } from 'antd'
import { DragOutlined, SettingOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons'
import { AlignAside } from '../../../component/style'
import store from '../../../store'

export default function Item({ data, openEdit, destroy }) {
  return <AlignAside>
    <DragOutlined />
    <Divider type="vertical" />
    <img src={store.app.imageLine + (data.cover || '/images/poster/nocover.jpg')} style={{ width: 40, height: 40, borderRadius: '50%' }} alt="" />
    <span>{data.name}</span>
    <Divider type="vertical" />
    <span style={{ flex: 1 }}>{data.title}</span>
    <SettingOutlined onClick={() => { openEdit(data) }} />
    <Divider type="vertical" />
    <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => { destroy(data) }}>
      <DeleteOutlined />
    </Popconfirm>
  </AlignAside>
}
