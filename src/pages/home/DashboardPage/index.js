import React, { useRef, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Padding, AlignAside } from '../../../component/style'
import { VisualBox, Icon } from '../../../component'
import ReactECharts from 'echarts-for-react';
import { useEffectOnce } from 'react-use'
import api from '../../../api'
import { notification } from 'antd';

export default function SignInPage() {
  // const store = useStore()
  useEffectOnce(() => {

  })
  return <Observer>{() => (
    <Padding style={{ position: 'relative' }}>

    </Padding>
  )}</Observer>
}