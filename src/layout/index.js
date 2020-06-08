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
          <Sider style={{ width: local.collapsed ? 80 : store.config.siderWidth }}>
            <Header style={hs}>
              <Avatar size={store.config.logoSize} src={logo} style={{ margin: '0 10px' }} alt="logo" />
              {!local.collapsed && store.config.name}
            </Header>
            <Menu collapsed={local.collapsed} />
          </Sider>
          <LayoutV>
            <Header style={{ ...hs, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button type="ghost" onClick={local.toggleCollapsed} style={{ marginLeft: 10 }}>
                {React.createElement(local.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
              </Button>
              <Dropdown
                visible={local.avatarVisible}
                onVisibleChange={flag => local.avatarVisible = flag}
                overlay={
                  <AMenu onClick={e => {
                    if (e.key === "sign-out") {
                      store.app.signOut()
                      router.goRoot()
                    }
                  }}>
                    <AMenu.Item key="sign-out">退出</AMenu.Item>
                  </AMenu>
                }
              >
                <div style={{ margin: '0 20px' }}>
                  <Avatar icon={<UserOutlined />} /><DownOutlined />
                </div>
              </Dropdown>
            </Header>
            <Content>{children}</Content>
          </LayoutV>
        </LayoutH>
      )}</Observer>

    )
}