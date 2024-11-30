import { types } from "mobx-state-tree";
import storage from '../utils/storage'

const user = types.model('user', {
  isSignIn: types.optional(types.boolean, false),
  token: types.optional(types.string, ''),
  account: types.optional(types.string, ''),
  nickname: types.optional(types.string, ''),
}).actions(self => ({
  signOut() {
    self.token = ''
    self.account = ''
    storage.removeKey('user-token')
    storage.removeKey('user-username')
    self.isSignIn = false
  },
  signIn({ token, account, nickname }) {
    self.token = token
    self.account = account
    self.nickname = nickname
    self.isSignIn = true
    storage.setValue('user-token', token)
    storage.setValue('user-account', account)
    storage.setValue('user-nickname', nickname)
  },
  setToken(token) {
    self.token = token
    if(token) {
      self.isSignIn = true
    }
    storage.setValue('user-token', token)
  },
  setAccount(name) {
    self.account = name
    storage.setValue('user-account', name)
  },
}))


export default user;