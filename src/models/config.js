import { types } from "mobx-state-tree";

const config = types.model('config', {
  name: types.optional(types.string, '后台管理'),
  logoSize: types.optional(types.number, 50),
  siderWidth: types.optional(types.number, 200),
  headerHeight: types.optional(types.number, 60),
  isDebug: types.optional(types.boolean, false),
  console: types.optional(types.boolean, false),
}).actions(self => ({
  set(key, value) {
    self[key] = value
  }
}));

export default config;