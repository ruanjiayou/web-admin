import React, { useEffect } from 'react'
import { Menu as Comp } from 'antd'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useRouter, useStore } from '../../contexts'
import { icon_map } from '../../pages'
import storage from '../../utils/storage'


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
    store.app.set('menuKey', router.history.location.pathname)
  }, [router.history.location])

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
    router.goPage(path, '', {})
  }
  return <Observer>{() => (
    <Comp
      style={{ flex: 'auto', overflowY: 'auto', overflowX: 'hidden' }}
      selectedKeys={[store.app.menuKey]}
      openKeys={collapsed ? [] : local.openKeys}
      mode="inline"
      inlineCollapsed={collapsed}
    >
      {
        store.menus.map(menu => {
          const Icon = icon_map[menu.icon]
          if (menu.children.length === 0) {
            return <Comp.Item key={menu.name} onClick={() => jump(menu.path, menu.name)} icon={Icon ? <Icon /> : ''}>{menu.title}</Comp.Item>
          } else {
            return <Comp.SubMenu title={menu.title} key={menu.name} icon={Icon ? <Icon /> : ''} onTitleClick={() => onToggle(menu.name)} >
              {menu.children.map(item => {
                const SIcon = icon_map[item.icon]
                return <Comp.Item key={item.name} onClick={() => jump(item.path, item.name)} icon={SIcon ? <SIcon /> : ''}>{item.title}</Comp.Item>
              })}
            </Comp.SubMenu>
          }
        })
      }
    </Comp>
  )
  }</Observer >
}

