import React, { Fragment } from 'react'
import { Avatar, Button, Dropdown, Menu as AMenu } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
import { useLocalStore, Observer } from 'mobx-react-lite'
import { LayoutV, LayoutH, Sider, Header, Content } from './style'
import logo from '../logo.svg'
import Menu from './Menu'
import { useStore, useRouter } from '../contexts'

export default function Layout({ children, single }) {
  const store = useStore()
  const router = useRouter()
  const local = useLocalStore(() => ({
    avatarVisible: false,
    appsVisible: false,
    collapsed: false,
    toggleCollapsed: () => {
      local.collapsed = !local.collapsed
    }
  }))
  const hs = {
    height: store.config.headerHeight,
    lineHeight: store.config.headerHeight + 'px'
  }
  return single ? <Fragment>
    {children}
  </Fragment> : (
    <Observer>{() => (
      <LayoutH>
        <Sider style={{ flexBasis: local.collapsed ? 80 : store.config.siderWidth }}>
          <Header style={hs}>
            <Avatar size={store.config.logoSize} src={logo} style={{ margin: '0 10px' }} alt="logo" />
            <Dropdown
              open={local.appsVisible}
              onOpenChange={flag => local.appsVisible = flag}
              menu={
                <AMenu style={{ minWidth: 100 }}>
                  {store.apps.map(app => (<AMenu.Item key={app.id}>{app.title}</AMenu.Item>))}
                </AMenu>
              }
            >
              <div style={{ display: 'inline-block' }}>
                {store.app.title}
              </div>
            </Dropdown>
          </Header>
          <Menu collapsed={local.collapsed} />
        </Sider>
        <LayoutV>
          <Header style={{ ...hs, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button type="ghost" onClick={local.toggleCollapsed} style={{ marginLeft: 10 }}>
              {React.createElement(local.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>
            <Dropdown
              open={local.avatarVisible}
              onOpenChange={flag => local.avatarVisible = flag}
              menu={
                <AMenu onClick={e => {
                  if (e.key === "sign-out") {
                    store.user.signOut()
                    router.goRoot()
                  }
                }}
                >
                  <AMenu.Item key="sign-out">退出</AMenu.Item>
                </AMenu>
              }
            >
              <div style={{ margin: '0 20px' }}>
                {store.user.username}
                <Avatar style={{ margin: '0 5px' }} icon={<UserOutlined />} /><DownOutlined />
              </div>
            </Dropdown>
          </Header>
          <Content style={{ flex: 1, overflow: 'auto' }}>{children}</Content>
        </LayoutV>
      </LayoutH>
    )}</Observer>

  )
}