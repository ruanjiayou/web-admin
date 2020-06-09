import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Form, Button, Input, Avatar } from 'antd'
import logo from '../../../logo.svg'
import { signIn } from '../../../api'
import store from '../../../store'
import { useRouter } from '../../../contexts'

export default function SignInPage() {
  const router = useRouter()
  return <Observer>{() => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Form>
        <Form.Item style={{ textAlign: 'center' }}>
          <Avatar src={logo} size={80} />
        </Form.Item>
        <Form.Item>
          <Input name="username" placeholder="用户名" />
        </Form.Item>
        <Form.Item>
          <Input name="password" type="password" placeholder="密码" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" block onClick={async () => {
            const res = await signIn({})
            if (res.code === 0) {
              store.user.signIn(res.data)
              router.goPage('/')
            }
          }}>登录</Button>
        </Form.Item>
      </Form>
    </div>
  )}</Observer>
}