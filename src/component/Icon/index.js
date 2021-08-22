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
  FileSearchOutlined,
  CopyOutlined,
  CloudServerOutlined,
  DragOutlined,
  EllipsisOutlined,
  CloudDownloadOutlined,
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
  'copy': CopyOutlined,
  'page-search': FileSearchOutlined,
  'store': CloudServerOutlined,
  'drag': DragOutlined,
  'more': EllipsisOutlined,
  'download': CloudDownloadOutlined,
};

export default function Icon({ type, style = {}, ...props }) {
  const I = IconMap[type]
  return <span style={style}><I {...props} /></span>
}