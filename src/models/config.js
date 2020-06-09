import { types } from "mobx-state-tree";

export const config = types.model('config', {
  name: types.string,
  logoSize: types.number,
  siderWidth: types.number,
  headerHeight: types.number,
}).actions(self => ({
  set(key, value) {
    self[key] = value
  }
}))