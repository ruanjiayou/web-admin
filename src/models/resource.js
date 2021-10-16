import { types } from 'mobx-state-tree'
import store from '../store'

export default types.model('Resource', {
  id: types.optional(types.string, ''),
  uid: types.optional(types.string, ''),
  uname: types.optional(types.string, ''),
  country: types.optional(types.string, ''),
  title: types.optional(types.string, ''),
  alias: types.optional(types.string, ''),
  poster: types.optional(types.string, ''),
  thumbnail: types.optional(types.string, ''),
  desc: types.optional(types.string, ''),
  url: types.optional(types.string, ''),
  source_id: types.optional(types.string, ''),
  source_type: types.optional(types.string, ''),
  source_name: types.optional(types.string, ''),
  tags: types.optional(types.array(types.string), []),
  images: types.optional(types.array(types.string), []),
  children: types.optional(types.array(types.model({
    id: types.string,
    url: types.string,
    path: types.string,
    title: types.optional(types.string, ''),
  })), []),
  status: types.optional(types.enumeration(['loading', 'finished']), 'finished'),
  types: types.optional(types.array(types.string), []),
  series: types.optional(types.string, ''),
  publishedAt: types.optional(types.string, ''),
  words: types.optional(types.number, 0),
  comments: types.optional(types.number, 0),
  collections: types.optional(types.number, 0),
  chapters: types.optional(types.number, 0),
  open: types.optional(types.boolean, true),
}).actions(self => ({
  setKV(key, value) {
    self[key] = value
  },
})).views(self => ({
  get cover() {
    return (self.poster.startsWith('http') || self.thumbnail.startsWith('http')) ? self.poster || self.thumbnail : store.app.imageLine + (self.poster || self.thumbnail || '/poster/nocover.jpg')
  }
}))