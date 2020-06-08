import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { createRouter } from './contexts'

import pages from './pages'
import Layout from './layout'
import { useStore } from './contexts'

function NoMatch() {
  const store = useStore()
  return store.app.isSignIn ? <Redirect to={'/home/dashboard'} /> : <Redirect to={'/auth/sign-in'} />
}

function Poster(props) {
  const [router, RouterContext] = createRouter(props.history)
  return <Observer>{() => {
    return <Fragment>
      <RouterContext.Provider value={router}>
        <Switch>
          {pages.map(({ pathname, Page, single = false }) => (
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