import { types } from "mobx-state-tree";

const app = types.model('app', {
  menuKey: types.optional(types.string, ''),
  groupMode: types.optional(types.string, 'preview'),
  imageLine: types.optional(types.string, 'http://localhost:8097')

}).actions(self => ({
  set(key, value) {
    if (key === 'menuKey')
      window.localStorage.setItem('menu-key', value)
    self[key] = value
  },
  toggleGroupMode() {
    self.groupMode = self.groupMode === 'edit' ? 'preview' : 'edit'
  },
}))

export default app;