import { types, getSnapshot } from 'mobx-state-tree'

const task = types.model('Task', {
  resource_id: types.string,
  rule_id: types.string,
  id: types.string,
  name: types.string,
  origin: types.string,
  status: types.string,
}).actions(self => ({
  setKV(key, value) {
    self[key] = value
  },
  toJSON() {
    return getSnapshot(self)
  },
}))

export default task;