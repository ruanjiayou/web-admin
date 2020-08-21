import React, { Fragment, Component } from 'react';
import Router from './router'
import ReactDOM from 'react-dom';
import { createStore } from './contexts'
import { Observer } from 'mobx-react-lite';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import 'react-contexify/dist/ReactContexify.min.css';

if (process.env.NODE_ENV === 'development') {
  // import('./mock').then(() => {
  //   console.log('mock started')
  // })
}

// 错误边界处理
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
      isLoading: false,
      lastTime: Date.now()
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
  }

  componentDidMount() {
    // TODO: loaded/error
  }

  render() {
    return <Fragment>
      {this.props.children}
    </Fragment>
  }
}

// 注入全局上下文
function App() {
  const [store, StoreContext] = createStore()
  return <Observer>{() => (
    <StoreContext.Provider value={store}>
      <Router />
    </StoreContext.Provider>
  )}</Observer>
}

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
