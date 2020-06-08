import React from 'react'
import { Menu as Comp } from 'antd'
import { DashboardOutlined, SettingOutlined } from '@ant-design/icons'
import { Observer } from 'mobx-react-lite'
import { useRouter } from '../../contexts'

const data = [
  {
    title: '总揽',
    name: 'dashboard',
    icon: <DashboardOutlined />,
    path: '/home/dashboard',
    sub: [],
  },
  {
    title: '设置',
    name: 'setting',
    icon: <SettingOutlined />,
    path: '/home/setting',
    sub: [
      {
        title: 'item1',
        name: 'item1',
        path: '/auth/sign-in',
        sub: [],
      },
      {
        title: 'item2',
        name: 'item2',
        path: '/home/manage/2',
        sub: [],
      },
    ],
  },
]

export default function Menu({ collapsed }) {
  const router = useRouter()
  function jump(path) {
    router.goPage(path, '', {})
  }
  return <Observer>{() => (
    <Comp
      style={{ flex: 'auto' }}
      defaultSelectedKeys={['dashboard']}
      defaultOpenKeys={[]}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
    >
      {
        data.map(menu => {
          if (menu.sub.length === 0) {
            return <Comp.Item key={menu.name} onClick={() => jump(menu.path)} icon={menu.icon}>{menu.title}</Comp.Item>
          } else {
            return <Comp.SubMenu title={menu.title} key={menu.name} icon={menu.icon}>
              {menu.sub.map(item => <Comp.Item key={item.name} onClick={() => jump(item.path)} icon={item.icon}>{item.title}</Comp.Item>)}
            </Comp.SubMenu>
          }
        })
      }
    </Comp>
  )
  }</Observer >
}

