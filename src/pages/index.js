import React from 'react'
import SignInPage from './auth/SignInPage'
import DashboardPage from './home/DashboardPage'
import ChannelManagePage from './home/ChannelManagePage'
import GroupManagePage from './home/GroupManagePage'
import ResourceManagePage from './home/ResourceManagePage'
import BackupPage from './home/DataManagePage/backup'
import SyncPage from './home/DataManagePage/sync'
import RulePage from './home/SpiderManagePage/rule'
import TaskPage from './home/SpiderManagePage/task'
import SchedulePage from './home/ScheduleManagePage'
import ResourceEdit from './home/ResourceManagePage/article'
import TradePage from './home/StockManagePage/trade'
import ExamineListPage from './home/ExamineManagePage/List'
import ExamineDetailPage from './home/ExamineManagePage/Detail'
import LinkManagePage from './home/LinkManagePage'
import { LinkOutlined, DashboardOutlined, FieldTimeOutlined, UnorderedListOutlined, AppstoreAddOutlined, HddOutlined, RadarChartOutlined, UsbOutlined, OrderedListOutlined, CloudSyncOutlined, CloudServerOutlined, StockOutlined, TransactionOutlined } from '@ant-design/icons'

const pages = [
  {
    pathname: '/admin/home/dashboard',
    Page: DashboardPage,
    title: '总揽',
    icon: <DashboardOutlined />,
  },
  {
    pathname: '/admin/home/ui',
    title: '界面编辑',
    icon: <AppstoreAddOutlined />
  },
  {
    pathname: '/admin/home/ui/channel-manage',
    Page: ChannelManagePage,
    title: '频道管理',
    icon: <UnorderedListOutlined />,
  },
  {
    pathname: '/admin/home/ui/group-manage',
    Page: GroupManagePage,
    title: '分组管理',
    icon: <UnorderedListOutlined />,
  },
  {
    pathname: '/admin/home/resource-manage',
    title: '资源管理',
    icon: <HddOutlined />,
  },
  {
    pathname: '/admin/home/resource-manage/list',
    Page: ResourceManagePage,
    title: '资源列表',
    icon: <UnorderedListOutlined />,
  },
  {
    pathname: '/admin/home/resource-manage/edit',
    Page: ResourceEdit,
    title: '资源编辑',
    icon: <UnorderedListOutlined />,
  },
  {
    pathname: '/admin/home/schedule-manage',
    Page: SchedulePage,
    title: '任务管理',
    icon: <FieldTimeOutlined />,
  },
  {
    pathname: '/admin/home/data-manage',
    title: '数据管理',
    icon: <UsbOutlined />,
  },
  {
    pathname: '/admin/home/data-manage/backup',
    Page: BackupPage,
    title: '数据备份',
    icon: <CloudServerOutlined />,
  },
  {
    pathname: '/admin/home/data-manage/sync',
    Page: SyncPage,
    title: '数据同步',
    icon: <CloudSyncOutlined />,
  },
  {
    pathname: '/admin/home/spider-manage',
    title: '爬虫管理',
    icon: <RadarChartOutlined />,
  },
  {
    pathname: '/admin/home/spider-manage/rule',
    Page: RulePage,
    title: '规则列表',
    icon: <OrderedListOutlined />,
  },
  {
    pathname: '/admin/home/spider-manage/task',
    Page: TaskPage,
    title: '任务列表',
    icon: <OrderedListOutlined />,
  },
  {
    pathname: '/admin/home/examine-manage',
    title: '问答管理',
    icon: <RadarChartOutlined />,
  },
  {
    pathname: '/admin/home/examine-manage/list',
    Page: ExamineListPage,
    title: '试卷列表',
    icon: <OrderedListOutlined />,
  },
  {
    pathname: '/admin/home/examine-manage/detail',
    Page: ExamineDetailPage,
    title: '试卷详情',
    icon: <OrderedListOutlined />,
  },
  {
    pathname: '/admin/home/stock-manage',
    title: '股票管理',
    icon: <StockOutlined />,
  },
  {
    pathname: '/admin/home/stock-manage/trade',
    Page: TradePage,
    title: '股票交易',
    icon: <TransactionOutlined />,
  },
  {
    pathname: '/admin/home/links',
    Page: LinkManagePage,
    title: '链接管理',
    icon: <LinkOutlined />,
  },
  {
    pathname: '/admin/auth/sign-in',
    Page: SignInPage,
    single: true,
  },
];
export default pages