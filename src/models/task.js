import { types, getSnapshot } from 'mobx-state-tree'
import apis from '../api'

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
  toggleStatus() {
    return apis.updateTask({ rule_id: self.rule_id, resource_id: self.resource_id, status: self.status === 'loading' ? 'finished' : 'loading' })
  },
  toJSON() {
    return getSnapshot(self)
  },
}))

export default task;