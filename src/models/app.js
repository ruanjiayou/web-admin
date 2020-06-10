import { types } from "mobx-state-tree";

export const app = types.model('app', {
  menuKey: types.optional(types.string, ''),
}).actions(self => ({
  set(key, value) {
    if (key === 'menuKey')
      window.localStorage.setItem('menu-key', value)
    self[key] = value
  }
}))