import React from 'react'
import { Menu as Comp } from 'antd'
import { DashboardOutlined, FieldTimeOutlined, UnorderedListOutlined, PicLeftOutlined, HddOutlined, RadarChartOutlined, UsbOutlined, OrderedListOutlined, CloudSyncOutlined, CloudServerOutlined } from '@ant-design/icons'
import { Observer } from 'mobx-react-lite'
import { useRouter, useStore } from '../../contexts'

const data = [
  {
    title: '总揽',
    name: 'dashboard',
    icon: <DashboardOutlined />,
    path: '/home/dashboard',
    sub: [],
  },
  {
    title: '频道管理',
    name: 'channel-manage',
    icon: <UnorderedListOutlined />,
    path: '/home/channel-manage',
    sub: [],
  },
  {
    title: '分组管理',
    name: 'group-manage',
    icon: <PicLeftOutlined />,
    path: '/home/group-manage',
    sub: [],
  },
  {
    title: '任务管理',
    name: 'schedule-manage',
    icon: <FieldTimeOutlined />,
    path: '/home/schedule-manage',
    sub: [],
  },
  {
    title: '资源管理',
    name: 'resource-manage',
    icon: <HddOutlined />,
    path: '/home/resource-manage',
    sub: [
      // {
      //   title: '资源列表',
      //   name: 'resource-list',
      //   icon: <OrderedListOutlined />,
      //   path: '/home/resource-list',
      //   sub: [],
      // },
      // {
      //   title: '编辑资源',
      //   name: 'resource-edit',
      //   path: '/home/resource-edit',
      //   sub: [],
      // },
    ],
  },
  {
    title: '数据管理',
    name: 'data-manage',
    icon: <UsbOutlined />,
    path: '/home/data-manage',
    sub: [
      {
        title: '数据备份',
        name: 'data-backup',
        icon: <CloudServerOutlined />,
        path: '/home/data-manage/backup',
        sub: [],
      },
      {
        title: '数据同步',
        name: 'data-sync',
        icon: <CloudSyncOutlined />,
        path: '/home/data-manage/sync',
        sub: [],
      },
    ],
  },
  {
    title: '爬虫管理',
    name: 'spider-manage',
    icon: <RadarChartOutlined />,
    path: '/home/spider-manage',
    sub: [
      {
        title: '规则列表',
        name: 'rule-list',
        icon: <OrderedListOutlined />,
        path: '/home/spider-manage/rule',
        sub: [],
      },
      {
        title: '任务列表',
        name: 'task-list',
        icon: <OrderedListOutlined />,
        path: '/home/spider-manage/task',
        sub: [],
      },
    ],
  },
]

export default function Menu({ collapsed }) {
  const router = useRouter()
  const store = useStore()
  function jump(path, key) {
    if (store.app.menuKey === key) {
      return;
    }
    store.app.set('menuKey', key)
    router.goPage(path, '', {})
  }
  return <Observer>{() => (
    <Comp
      style={{ flex: 'auto', overflowY: 'auto', overflowX: 'hidden' }}
      defaultSelectedKeys={[store.app.menuKey]}
      // defaultOpenKeys={[store.app.menuKey]}
      openKeys={['spider-manage', 'data-manage']}
      mode="inline"
      inlineCollapsed={collapsed}
    >
      {
        data.map(menu => {
          if (menu.sub.length === 0) {
            return <Comp.Item key={menu.name} onClick={() => jump(menu.path, menu.name)} icon={menu.icon}>{menu.title}</Comp.Item>
          } else {
            return <Comp.SubMenu title={menu.title} key={menu.name} icon={menu.icon}>
              {menu.sub.map(item => <Comp.Item key={item.name} onClick={() => jump(item.path, item.name)} icon={item.icon}>{item.title}</Comp.Item>)}
            </Comp.SubMenu>
          }
        })
      }
    </Comp>
  )
  }</Observer >
}

