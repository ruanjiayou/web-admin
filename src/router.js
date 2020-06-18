import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { createRouter } from './contexts'

import pages from './pages'
import Layout from './layout'
import { useStore } from './contexts'

function NoMatch() {
  const store = useStore()
  return store.user.isSignIn ? <Redirect to={store.app.menuKey || '/home/dashboard'} /> : <Redirect to={'/auth/sign-in'} />
}

function Poster(props) {
  const store = useStore()
  const [router, RouterContext] = createRouter(props.history)
  return <Observer>{() => {
    if (props.history.location.pathname.startsWith('/home') && store.user.isSignIn === false) {
      return <Redirect to={'/auth/sign-in'} />
    }
    return <Fragment>
      <RouterContext.Provider value={router}>
        <Switch>
          {pages.filter(page=>!!page.Page).map(({ pathname, Page, single = false }) => (
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