import { types } from 'mobx-state-tree'
import store from '../store'

export default types.model('Resource', {
  _id: types.string,
  uid: types.maybeNull(types.string),
  uname: types.maybeNull(types.string),
  country: types.maybeNull(types.string, 'CN'),
  title: types.string,
  alias: types.optional(types.string, ''),
  poster: types.optional(types.string, ''),
  thumbnail: types.optional(types.string, ''),
  content: types.optional(types.string, ''),
  desc: types.optional(types.string, ''),
  // url: types.string,
  spider_id: types.optional(types.string, ''),
  source_id: types.optional(types.string, ''),
  source_type: types.maybeNull(types.string),
  tags: types.array(types.string),
  images: types.array(
    types.union(
      types.string,
      types.model({
        path: types.optional(types.string, ''),
        _id: types.optional(types.string, ''),
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
  videos: types.optional(types.array(types.model({
    _id: types.string,
    url: types.string,
    path: types.string,
    title: types.optional(types.string, ''),
  })), []),
  actors: types.array(types.model({ _id: types.string, name: types.string })),
  status: types.number,
  types: types.optional(types.array(types.string), []),
  series: types.optional(types.string, ''),
  publishedAt: types.maybeNull(types.optional(types.string, '')),
  words: types.maybe(types.number),
  duration: types.maybe(types.number),
}).actions(self => ({
  setKV(key, value) {
    self[key] = value
  },
})).views(self => ({
  get cover() {
    return (self.poster.startsWith('http') || self.thumbnail.startsWith('http')) ? self.poster || self.thumbnail : store.app.imageLine + (self.poster || self.thumbnail || '/images/poster/nocover.jpg')
  }
}))