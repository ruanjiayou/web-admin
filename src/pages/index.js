import SignInPage from './auth/SignInPage'
import DashboardPage from './home/DashboardPage'
import ChannelManagePage from './home/ChannelManagePage'
import GroupManagePage from './home/GroupManagePage'
import ResourceManagePage from './home/ResourceManagePage'
import BackupPage from './home/DataManagePage/backup'
import FilePage from './home/DataManagePage/file'
import SyncPage from './home/DataManagePage/sync'
import RulePage from './home/SpiderManagePage/rule'
import Rule2Page from './home/SpiderManagePage/rule2'
import TaskPage from './home/SpiderManagePage/task'
import DownloadPage from './home/DownloadManagePage'
import SchedulePage from './home/ScheduleManagePage'
import ResourceEdit from './home/ResourceManagePage/article'
import TradePage from './home/StockManagePage/trade'
import ExamineListPage from './home/ExamineManagePage/List'
import ExamineDetailPage from './home/ExamineManagePage/Detail'
import LinkManagePage from './home/LinkManagePage'
import LineManagePage from './home/LineManagePage'
import ConfigPage from './home/ConfigPage'
import RobotManage from './home/RobotManage'
import BackupTablePage from './home/DataManagePage/table'
import MuiltiEdit from './home/ResourceManagePage/multi'
import AppManagePage from './home/AppManagePage'
import ComponentManagePage from './home/ComponentManagePage'
import FeedbackPage from './home/FeedbackPage'
import SpiderPage from './home/SpiderManagePage/spider'

import {
  LinkOutlined,
  DashboardOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  HddOutlined,
  RadarChartOutlined,
  UsbOutlined,
  OrderedListOutlined,
  CloudSyncOutlined,
  CloudServerOutlined,
  StockOutlined,
  TransactionOutlined,
  AndroidOutlined,
  QuestionCircleOutlined,
  FolderOutlined,
  DownloadOutlined,
} from '@ant-design/icons'

const page_map = {
  'SignInPage': SignInPage,
  'DashboardPage': DashboardPage,
  'ChannelManagePage': ChannelManagePage,
  'GroupManagePage': GroupManagePage,
  'ResourceManagePage': ResourceManagePage,
  'BackupPage': BackupPage,
  'FilePage': FilePage,
  'SyncPage': SyncPage,
  'RulePage': RulePage,
  'Rule2Page': Rule2Page,
  'TaskPage': TaskPage,
  'SchedulePage': SchedulePage,
  'ResourceEdit': ResourceEdit,
  'TradePage': TradePage,
  'ExamineListPage': ExamineListPage,
  'ExamineDetailPage': ExamineDetailPage,
  'LinkManagePage': LinkManagePage,
  'LineManagePage': LineManagePage,
  'ConfigPage': ConfigPage,
  'RobotManage': RobotManage,
  'BackupTablePage': BackupTablePage,
  'MuiltiEdit': MuiltiEdit,
  'AppManagePage': AppManagePage,
  'ComponentManagePage': ComponentManagePage,
  'FeedbackPage': FeedbackPage,
  'SpiderPage': SpiderPage,
  'DownloadPage': DownloadPage,
}
export const icon_map = {
  LinkOutlined,
  DashboardOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  HddOutlined,
  RadarChartOutlined,
  UsbOutlined,
  OrderedListOutlined,
  CloudSyncOutlined,
  CloudServerOutlined,
  StockOutlined,
  TransactionOutlined,
  AndroidOutlined,
  QuestionCircleOutlined,
  FolderOutlined,
  DownloadOutlined,
};

export function pagination(menus) {
  return menus.map(menu => ({
    pathname: menu.pathname,
    Page: page_map[menu.Page] || null,
    icon: menu.icon,// icon_map[menu.icon] || '',
    hide: menu.hide || false,
    title: menu.title,
    single: menu.single || false
  }));
}

export function adjustMenu(pages) {
  const data = [];
  pages.forEach(page => {
    let curr = data;
    if (!page.pathname.startsWith('/admin/home') || page.hide === true) {
      return;
    }
    if (data.length === 0) {
      data.push({
        title: page.title,
        path: page.pathname,
        name: page.pathname,
        icon: page.icon,
        sub: [],
      })
    } else {
      if (page.pathname.startsWith(data[data.length - 1].path)) {
        curr = data[data.length - 1].sub
      }
      curr.push({
        title: page.title,
        path: page.pathname,
        name: page.pathname,
        icon: page.icon,
        sub: [],
      })
    }
  });
  return data;
}
export function pagination2(menus) {
  const pages = [];
  menus.forEach(menu => {
    pages.push({
      pathname: menu.pathname,
      Page: page_map[menu.Page] || null,
      icon: menu.icon,// icon_map[menu.icon] || '',
      hide: menu.hide || false,
      title: menu.title,
      single: menu.single || false
    });
    menu.children.forEach(item => {
      pages.push({
        pathname: item.pathname,
        Page: page_map[item.Page] || null,
        icon: item.icon,// icon_map[menu.icon] || '',
        hide: item.hide || false,
        title: item.title,
        single: item.single || false
      })
    })
  });
  return pages;
}


export function adjustMenu2(tree) {
  const data = [];
  tree.forEach(page => {
    if (!page.pathname.startsWith('/admin/home') || page.hide === true) {
      return;
    }
    page.children = page.children.map(child => ({
      title: child.title,
      path: child.pathname,
      name: child.pathname,
      icon: child.icon,
    }))
    data.push({
      title: page.title,
      path: page.pathname,
      name: page.pathname,
      icon: page.icon,
      children: page.children,
    })
  })
  return data;
}