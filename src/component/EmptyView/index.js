import React from 'react'
import Icon from '../Icon'
import { CenterXY } from '../../component/style'

export default function EmptyView() {
  return <CenterXY>
    <Icon type="circle-info" />没有数据
  </CenterXY>
}