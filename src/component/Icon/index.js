import React from 'react'
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  RightOutlined,
  SyncOutlined,
  FormOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

const IconMap = {
  'loading': LoadingOutlined,
  'plus': PlusOutlined,
  'circle-plus': PlusCircleOutlined,
  'circle-info': InfoCircleOutlined,
  'circle-minus': MinusCircleOutlined,
  'arrow-right': RightOutlined,
  'arrow-up-line': ArrowUpOutlined,
  'arrow-down-line': ArrowDownOutlined,
  'sync-horizon': SyncOutlined,
  'edit': FormOutlined,
  'delete': DeleteOutlined,
};

export default function Icon({ type, ...props }) {
  const I = IconMap[type]
  return <I {...props} />
}