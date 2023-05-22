import React from 'react'
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
import SchedulePage from './home/ScheduleManagePage'
import ResourceEdit from './home/ResourceManagePage/article'
import TradePage from './home/StockManagePage/trade'
import ExamineListPage from './home/ExamineManagePage/List'
import ExamineDetailPage from './home/ExamineManagePage/Detail'
import LinkManagePage from './home/LinkManagePage'
import ConfigPage from './home/ConfigPage'
import RobotManage from './home/RobotManage'
import BackupTablePage from './home/DataManagePage/table'
import MuiltiEdit from './home/ResourceManagePage/multi'
import AppManagePage from './home/AppManagePage'
import ComponentManagePage from './home/ComponentManagePage'
import FeedbackPage from './home/FeedbackPage'

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
  'ConfigPage': ConfigPage,
  'RobotManage': RobotManage,
  'BackupTablePage': BackupTablePage,
  'MuiltiEdit': MuiltiEdit,
  'AppManagePage': AppManagePage,
  'ComponentManagePage':ComponentManagePage,
  'FeedbackPage': FeedbackPage,
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