import { types } from "mobx-state-tree";

export const user = types.model('user', {
  isSignIn: types.optional(types.boolean, false),
  token: types.optional(types.string, ''),
  username: types.optional(types.string, ''),
}).actions(self => ({
  signOut() {
    self.token = ''
    self.username = ''
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-username')
    self.isSignIn = false
  },
  signIn({ token, username }) {
    self.token = token
    self.username = username
    self.isSignIn = true
    localStorage.setItem('user-token', token)
    localStorage.setItem('user-username', username)
  }
}))