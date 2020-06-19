import React, { Fragment } from 'react'
import { Observer } from 'mobx-react-lite'
import { useStore } from '../../../contexts'
import { Button } from 'antd'

export default function SignInPage() {
  const store = useStore()
  return <Observer>{() => (
    <Fragment>
      <div>
        Hello, World!
        {Object.keys(store.messages).map((key, i) => {
          const message = store.messages[key].stack
          if (message) {
            return <div key={i}>
              <Button onClick={() => {
                store.messages[key].clear()
              }}>clear</Button>
              <div>
                {message.length ? JSON.stringify(message[message.length - 1]) : key}
              </div>
            </div>
          }
          return <div key={i}>{key}</div>
        })}
      </div>
    </Fragment>
  )}</Observer>
}