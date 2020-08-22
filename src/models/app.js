import { types } from "mobx-state-tree";

const app = types.model('app', {
  storagePrefix: types.optional(types.string, 'novel_admin_'),
  menuKey: types.optional(types.string, ''),
  groupMode: types.optional(types.string, 'edit'),
  imageLine: types.optional(types.string, ''),
  baseUrl: types.optional(types.string, ''),
}).actions(self => ({
  set(key, value) {
    self[key] = value
  },
  toggleGroupMode() {
    self.groupMode = self.groupMode === 'edit' ? 'preview' : 'edit'
  },
}))

export default app;