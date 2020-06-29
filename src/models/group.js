import { types } from 'mobx-state-tree'
import resource from './resource'

const GroupModel = types.model('Group', {
  tree_id: types.string,
  id: types.string,
  parent_id: types.string,
  title: types.optional(types.string, ''),
  name: types.string,
  desc: types.string,
  view: types.string,
  refs: types.array(types.string),
  data: types.array(resource),
  attrs: types.model({
    hide_title: types.boolean,
    allowChange: types.boolean,
    selected: types.maybeNull(types.boolean),
    timeout: types.maybeNull(types.number),
    columns: types.maybeNull(types.number),
    showCount: types.maybeNull(types.number),
  }),
  params: types.frozen(null, {}),
  more: types.model({
    channel_id: types.string,
    keyword: types.string,
    type: types.string,
  }),
  nth: types.number,
  open: types.optional(types.boolean, true),
  children: types.optional(types.array(types.late(() => GroupModel)), []),
}).views(self => ({

})).actions(self => ({
  selectMe(id = '') {
    const found = self.children.find(child => child.id === id)
    if (found === undefined || id === '') {
      id = self.id
    }
    self.attrs.selected = id === self.id ? true : false
    self.children.forEach(child => {
      child.attrs.selected = child.id === id ? true : false
    })
  }
}))

export default GroupModel