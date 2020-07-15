import { types } from "mobx-state-tree";
import storage from '../utils/storage'

const user = types.model('user', {
  isSignIn: types.optional(types.boolean, false),
  token: types.optional(types.string, ''),
  username: types.optional(types.string, ''),
}).actions(self => ({
  signOut() {
    self.token = ''
    self.username = ''
    storage.removeKey('user-token')
    storage.removeKey('user-username')
    self.isSignIn = false
  },
  signIn({ token, username }) {
    self.token = token
    self.username = username
    self.isSignIn = true
    storage.setValue('user-token', token)
    storage.setValue('user-username', username)
  },
  setToken(token) {
    self.token = token
    if(token) {
      self.isSignIn = true
    }
    storage.setValue('user-token', token)
  },
  setUsername(name) {
    self.username = name
    storage.setValue('user-username', name)
  },
}))


export default user;