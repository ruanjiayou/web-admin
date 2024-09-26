import React, { Fragment, useRef, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useStore } from '../../../contexts'
import shttp from '../../../utils/shttp'
import { Padding, AlignAside } from '../../../component/style'
import { VisualBox, Icon } from '../../../component'
import { useEffectOnce } from 'react-use'
import api from '../../../api'
import { notification } from 'antd';

// function testUpload(data) {
//   const form = new FormData()
//   for (let k in data) {
//     form.append(k, data[k])
//   }
//   return shttp({
//     url: `/v1/public/test/upload`,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'multipart/form-data;charset=UTF-8'
//     },
//     data: form,
//   })
// }
export default function SignInPage() {
  // const store = useStore()
  // const file = useRef(null)
  const store = useLocalStore(() => ({
    showKline: false,
    klineY: 0
  }))

  useEffectOnce(() => {
    
  })
  return <Observer>{() => (
    <Padding style={{ position: 'relative' }}>

    </Padding>
  )}</Observer>
}