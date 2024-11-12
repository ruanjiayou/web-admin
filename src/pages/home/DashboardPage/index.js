import React, { useRef, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Padding, AlignAside } from '../../../component/style'
import { useEffectOnce } from 'react-use'

export default function SignInPage() {
  // const store = useStore()
  useEffectOnce(() => {

  })
  return <Observer>{() => (
    <Padding style={{ position: 'relative' }}>

    </Padding>
  )}</Observer>
}