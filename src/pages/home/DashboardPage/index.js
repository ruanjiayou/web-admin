import React, { Fragment, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useStore } from '../../../contexts'
import shttp from '../../../utils/shttp'
import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Padding } from '../../../component/style'

function testUpload(data) {
  const form = new FormData()
  for (let k in data) {
    form.append(k, data[k])
  }
  return shttp({
    url: `/v1/public/test/upload`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}
export default function SignInPage() {
  const store = useStore()
  const file = useRef(null)
  const local = useLocalStore(() => ({
    loading: false
  }))
  return <Observer>{() => (
    <Padding>
      <Upload ref={file} name="test" action={'/v1/public/test/upload'} headers={{}} onChange={info => {
        if (info.file.status === 'uploading') {
          local.loading = true
        }
        if (info.file.status === 'done' || info.file.status === 'error') {
          local.loading = false
        }
      }}>
        <Button loading={local.loading}>
          <UploadOutlined /> 上传
        </Button>
      </Upload>
      <div>
        Hello, World!
        {Object.keys(store.messages).map((key, i) => {
        const message = store.messages[key].stack
        if (message) {
          return <div key={i}>
            <Button onClick={() => {
              store.messages[key].clear()
            }}>clear</Button>
            <div>
              {message.length ? JSON.stringify(message[message.length - 1]) : key}
            </div>
          </div>
        }
        return <div key={i}>{key}</div>
      })}
      </div>
    </Padding>
  )}</Observer>
}