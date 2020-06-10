import SignInPage from './auth/SignInPage'
import DashboardPage from './home/DashboardPage'
import ResourceManagePage  from './home/ResourceManagePage'

const pages = [
  {
    pathname: '/home/dashboard',
    Page: DashboardPage,
    single: false,
  },
  {
    pathname: '/home/resource-manage',
    Page: ResourceManagePage,
    single: false,
  },
  {
    pathname: '/auth/sign-in',
    Page: SignInPage,
    single: true,
  },
];
export default pages