import React from 'react'
import { Menu as Comp } from 'antd'
import { Observer } from 'mobx-react-lite'
import { useRouter, useStore } from '../../contexts'
import pages from '../../pages'

const data = []
pages.forEach(page => {
  let curr = data;
  if (!page.pathname.startsWith('/admin/home')) {
    return;
  }
  if (data.length === 0) {
    data.push({
      title: page.title,
      path: page.pathname,
      name: page.pathname,
      icon: page.icon,
      sub: [],
    })
  } else {
    if (page.pathname.startsWith(data[data.length - 1].path)) {
      curr = data[data.length - 1].sub
    }
    curr.push({
      title: page.title,
      path: page.pathname,
      name: page.pathname,
      icon: page.icon,
      sub: [],
    })
  }

})

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
      openKeys={collapsed ? [] : ['/admin/home/ui', '/admin/home/data-manage', '/admin/home/spider-manage']}
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

