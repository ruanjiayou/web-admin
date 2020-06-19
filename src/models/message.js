import { types } from 'mobx-state-tree'

const Message = types.model('Message', {
  key: types.string,
  stack: types.array(types.model({
    name: types.string,
    module: types.string,
    type: types.string,
    data: types.frozen({}),
  }))
}).actions(self => ({
  push(data) {
    self.stack.push(data)
  },
  clear() {
    self.stack = []
  }
}))

export default Message;