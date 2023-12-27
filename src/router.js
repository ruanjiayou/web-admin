import React, { Fragment } from 'react'
import { Observer, } from 'mobx-react-lite'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { createRouter } from './contexts'

import Layout from './layout'
import { useStore } from './contexts'
import { Icon } from './component';
import { FullHeight, FullHeightAuto, FullHeightFix } from './component/style';

function NoMatch() {
  const store = useStore()
  return store.user.isSignIn ? <Redirect to={store.app.menuKey} /> : <Redirect to={'/admin/auth/sign-in'} />
}

function Poster(props) {
  const store = useStore()
  const [router, RouterContext] = createRouter(props.history)
  return <Observer>{() => {
    if (props.history.location.pathname.startsWith('/admin/home') && store.user.isSignIn === false) {
      return <Redirect to={'/admin/auth/sign-in'} />
    }
    return <Fragment>
      <div style={{ position: 'fixed', bottom: 50, right: 50, zIndex: 9 }}>
        <FullHeight style={{ width: 500, maxHeight: 600, display: store.logger.status === 'open' ? 'flex' : 'none', backgroundColor: 'gray', color: 'white', padding: 5, }}>
          <FullHeightAuto>
            {store.logger.logs.map(log => (<div key={log.no}>{log.message}</div>))}
          </FullHeightAuto>
          <FullHeightFix>
            {store.logger.keys.map(key => (<div key={key}>{store.logger.progress.get(key).message}</div>))}
          </FullHeightFix>
        </FullHeight>

        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffeb00' }} onClick={() => {
          store.logger.toggle();
        }}>
          <Icon type={store.logger.status === 'open' ? 'delete' : 'more'} />
        </div>
      </div>
      <RouterContext.Provider value={router}>
        <Switch>
          {store.pages.filter(page => !!page.Page).map(({ pathname, Page, single = false }) => (
            <Route key={pathname} path={pathname} render={props => (
              <Layout {...props} single={single}>
                <Page />
              </Layout>
            )} />
          ))}
          <Route component={NoMatch} />
        </Switch>
      </RouterContext.Provider>
    </Fragment>
  }}</Observer>
}

export default function router() {
  return <BrowserRouter basename="/">
    <Route path="/*" component={Poster} />
  </BrowserRouter>
}