import { types } from "mobx-state-tree";
const appModel = types.model('app', {
  isSignIn: types.optional(types.boolean, false),
}).actions(self => ({
  signOut() {
    self.isSignIn = false
  }
}))

const configModel = types.model('config', {
  name: types.string,
  logoSize: types.number,
  siderWidth: types.number,
  headerHeight: types.number,
}).actions(self => ({
  set(key, value) {
    self[key] = value
  }
}))

export default {
  app: appModel.create({ isSignIn: true }),
  config: configModel.create({
    name: '后台管理',
    logoSize: 50,
    siderWidth: 200,
    headerHeight: 60,
  })
}