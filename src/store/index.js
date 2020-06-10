import models from '../models/index'

export default {
  app: models.app.create({
    menuKey: window.localStorage.getItem('menu-key') || 'dashboard',
  }),
  user: models.user.create({
    isSignIn: localStorage.getItem('user-token') ? true : false,
    token: localStorage.getItem('user-token') || '',
    username: localStorage.getItem('user-username') || '',
  }),
  config: models.config.create({
    name: '后台管理',
    logoSize: 50,
    siderWidth: 200,
    headerHeight: 60,
  })
}