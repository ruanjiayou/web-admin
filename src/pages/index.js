import SignInPage from './auth/SignInPage'
import DashboardPage from './home/DashboardPage'
import ResourceManagePage from './home/ResourceManagePage'
import BackupPage from './home/DataManagePage/backup'
import SyncPage from './home/DataManagePage/sync'
import RulePage from './home/SpiderManagePage/rule'
import TaskPage from './home/SpiderManagePage/task'

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
    pathname: '/home/data-manage/backup',
    Page: BackupPage,
    single: false,
  },
  {
    pathname: '/home/data-manage/sync',
    Page: SyncPage,
    single: false,
  },
  {
    pathname: '/home/spider-manage/rule',
    Page: RulePage,
    single: false,
  },
  {
    pathname: '/home/spider-manage/task',
    Page: TaskPage,
    single: false,
  },
  {
    pathname: '/auth/sign-in',
    Page: SignInPage,
    single: true,
  },
];
export default pages