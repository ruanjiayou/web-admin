import SignInPage from './auth/SignInPage'
import DashboardPage from './home/DashboardPage'

const pages = [
  {
    pathname: '/home/dashboard',
    Page: DashboardPage,
    single: false,
  },
  {
    pathname: '/auth/sign-in',
    Page: SignInPage,
    single: true,
  },
];
export default pages