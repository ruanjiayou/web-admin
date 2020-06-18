import { types } from 'mobx-state-tree'
import apis from '../api'
import store from '../store'

export default types.model('Resource', {
  id: types.optional(types.string, ''),
  uid: types.optional(types.string, ''),
  uname: types.optional(types.string, ''),
  country: types.optional(types.string, ''),
  title: types.optional(types.string, ''),
  poster: types.optional(types.string, ''),
  desc: types.optional(types.string, ''),
  url: types.optional(types.string, ''),
  source_type: types.optional(types.string, ''),
  tags: types.optional(types.array(types.string), []),
  images: types.optional(types.array(types.string), []),
  status: types.optional(types.enumeration(['loading', 'finished']), 'finished'),
  type: types.optional(types.string, ''),
  createdAt: types.optional(types.string, ''),
  words: types.optional(types.number, 0),
  comments: types.optional(types.number, 0),
  collections: types.optional(types.number, 0),
  chapters: types.optional(types.number, 0),
  open: types.optional(types.boolean, true),
}).actions(self => ({
  setKV(key, value) {
    self[key] = value
  },
  toggleOpen() {
    return apis.updateResource({ id: self.id, open: !self.open })
  },
  toggleStatus() {
    return apis.updateResource({ id: self.id, status: self.status === 'loading' ? 'finished' : 'loading' })
  },
  toJSON() {
    return apis.getSnapshot(self)
  }
})).views(self => ({
  get cover() {
    return store.app.imageLine + (self.poster || '/poster/nocover.jpg')
  }
}))