import React, { useEffect } from 'react'
import { Menu as Comp } from 'antd'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouter, useStore } from '../../contexts'
import pages from '../../pages'
import storage from '../../utils/storage'

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
  const local = useLocalStore(() => ({
    openKeys: [],
  }))
  useEffect(() => {
    const menuKey = storage.getValue('menu-title')
    if (menuKey) {
      local.openKeys = [menuKey]
    }
  })

  function onToggle(key) {
    const i = local.openKeys.indexOf(key)
    if (-1 === i) {
      local.openKeys.push(key)
      storage.setValue('menu-title', key)
    } else {
      local.openKeys.splice(i, 1)
      storage.setValue('menu-title', '')
    }
  }

  function jump(path, key) {
    if (store.app.menuKey === key) {
      return;
    }
    store.app.set('menuKey', key)
    storage.setValue('menu-key', key)
    router.goPage(path, '', {})
  }
  return <Observer>{() => (
    <Comp
      style={{ flex: 'auto', overflowY: 'auto', overflowX: 'hidden' }}
      defaultSelectedKeys={[store.app.menuKey]}
      openKeys={collapsed ? [] : local.openKeys}
      mode="inline"
      inlineCollapsed={collapsed}
    >
      {
        data.map(menu => {
          if (menu.sub.length === 0) {
            return <Comp.Item key={menu.name} onClick={() => jump(menu.path, menu.name)} icon={menu.icon}>{menu.title}</Comp.Item>
          } else {
            return <Comp.SubMenu title={menu.title} key={menu.name} onTitleClick={() => onToggle(menu.name)} icon={menu.icon}>
              {menu.sub.map(item => <Comp.Item key={item.name} onClick={() => jump(item.path, item.name)} icon={item.icon}>{item.title}</Comp.Item>)}
            </Comp.SubMenu>
          }
        })
      }
    </Comp>
  )
  }</Observer >
}

