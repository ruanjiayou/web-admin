import { types } from 'mobx-state-tree'
import store from '../store'

export default types.model('Resource', {
  id: types.string,
  uid: types.maybeNull(types.string),
  uname: types.maybeNull(types.string),
  country: types.maybeNull(types.string, 'China'),
  title: types.string,
  alias: types.optional(types.string, ''),
  poster: types.optional(types.string, ''),
  thumbnail: types.optional(types.string, ''),
  content: types.optional(types.string, ''),
  desc: types.optional(types.string, ''),
  // url: types.string,
  source_id: types.optional(types.string, ''),
  source_type: types.maybeNull(types.string),
  tags: types.array(types.string),
  images: types.array(
    types.union(
      types.string,
      types.model({
        path: types.optional(types.string, ''),
        id: types.optional(types.string, ''),
        nth: types.optional(types.number, 1),
        more: types.maybe(
          types.model({
            width: types.maybe(types.number),
            height: types.maybe(types.number),
          }),
        ),
      }),
    ),
  ),
  children: types.optional(types.array(types.model({
    id: types.string,
    url: types.string,
    path: types.string,
    title: types.optional(types.string, ''),
  })), []),
  status: types.optional(types.enumeration(['init', 'loading', 'finished']), 'finished'),
  types: types.optional(types.array(types.string), []),
  series: types.optional(types.string, ''),
  publishedAt: types.maybeNull(types.optional(types.string, '')),
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
    return (self.poster.startsWith('http') || self.thumbnail.startsWith('http')) ? self.poster || self.thumbnail : store.app.imageLine + (self.poster || self.thumbnail || '/images/poster/nocover.jpg')
  }
}))