import React, { Fragment, useCallback, useEffect } from 'react'
import { Avatar, Button, Dropdown, Menu as AMenu } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
import { useLocalStore, Observer } from 'mobx-react-lite'
import logo from './images/logo.svg'
import { useStore, useRouter } from './contexts'
import { toJS } from 'mobx'
import styled from 'styled-components'

const LayoutV = styled.div`
  display: flex;
  height: 100%;
  flex: auto;
  flex-direction: column;
  overflow: hidden;
`;

const LayoutH = styled.div`
  display: flex;
  height: 100%;
  flex: auto;
  flex-direction: row;
`;

const Sider = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const Header = styled.div`
  height: 60px;
  line-height: 60px;
`;

const Content = styled.div`
  
`;

const CustomDiv = styled.div`
  overflow-y: auto;
  scrollbar-color: light;
  scrollbar-width: none;
`

export default function Layout({ children, single }) {
  const store = useStore()
  const router = useRouter()
  const local = useLocalStore(() => ({
    avatarVisible: false,
    appsVisible: false,
    collapsed: false,
    selectedKeys: [store.app.menuKey],
    openKeys: toJS(store.app.openKeys),
    toggleCollapsed: () => {
      local.collapsed = !local.collapsed
    },
    setOpenKeys(keys) {
      local.openKeys = keys;
      store.app.setOpenKeys(keys);
    },
    setMenyKey(key) {
      local.selectedKeys = [key];
      store.app.setMenuKey(key);
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
          <CustomDiv>
            <AMenu
              style={{ height: '100%' }}
              items={toJS(store.menus)}
              inlineCollapsed={local.collapsed}
              selectedKeys={local.selectedKeys}
              openKeys={local.openKeys}
              mode="inline"
              onOpenChange={keys => {
                local.setOpenKeys(keys);
              }}
              onSelect={e => {
                local.setMenyKey(e.key)
                router.goPage(e.key)
              }}
            />
          </CustomDiv>
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