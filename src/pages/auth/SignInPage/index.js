import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Form, Button, Input, Avatar, message } from 'antd'
import logo from '../../../logo.svg'
import apis from '../../../api'
import store from '../../../store'
import { useRouter } from '../../../contexts'

export default function SignInPage() {
  const router = useRouter()
  const local = useLocalStore(() => ({
    isFetch: false,
    username: '',
    password: '',
  }))
  return <Observer>{() => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Form>
        <Form.Item style={{ textAlign: 'center' }}>
          <Avatar src={logo} size={80} />
        </Form.Item>
        <Form.Item>
          <Input name="username" onChange={e => local.username = e.target.value} placeholder="用户名" />
        </Form.Item>
        <Form.Item>
          <Input name="password" onChange={e => local.password = e.target.value} type="password" placeholder="密码" onKeyDown={e => {
            if (e.keyCode === 13) {
              document.getElementById('signin').click();
            }
          }} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button id="signin" type="primary" loading={local.isFetch} block onClick={async () => {
            local.isFetch = true
            try {
              const res = await apis.signIn({ data: { name: local.username, password: local.password } })
              if (res.code === 0) {
                store.user.signIn({ token: res.data.token, username: local.username })
                router.goPage('/admin/home/dashboard')
              } else {
                message.error(res.message)
              }
            } catch (e) {
              message.error(e.message)
            } finally {
              local.isFetch = false
            }
          }}>登录</Button>
        </Form.Item>
      </Form>
    </div>
  )}</Observer>
}