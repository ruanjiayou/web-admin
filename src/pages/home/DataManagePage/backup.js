import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined, UploadOutlined, CloudDownloadOutlined, HddOutlined, FileZipOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, FullWidthAuto } from '../../../component/style'


const { getBackups, createBackup, destroyBackup, syncBackup2prod, downloadBackup2zip, recoveryByBackup, zip2backup } = apis
const { Column } = Table;

export default function TaskList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    backups: [],
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      resource_id: local.resource_id,
      page: local.search_page,
    }
    getBackups(query).then(res => {
      local.isLoading = false
      local.backups = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffect(() => {
    search()
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: '20px 0' }}>
        <Right>
          <Button type="primary" loading={local.isLoading} disabled={local.isLoading} onClick={e => {
            createBackup().then(res => {
              if (res.code === 0) {
                notification.success({ message: '创建成功' });
                search();
              } else {
                notification.error({ message: '创建失败' });
              }
            })
          }}>创建备份</Button>
          <Divider type="vertical" />
          <Button onClick={search}>刷新</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto>
        <Table dataSource={local.backups} rowKey="dir" pagination={false} loading={local.isLoading}>
          <Column title="备份" dataIndex="dir" key="dir" render={(text, record) => {
            return record.type === 'zip' ? text + '.zip' : text
          }} />
          <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => {
            if (record.type === 'zip') {
              return <FileZipOutlined title="解压zip" onClick={() => {
                zip2backup(record).then(res => {
                  if (res.code === 0) {
                    notification.success({ message: '操作成功' });
                    search();
                  } else {
                    notification.error({ message: '操作失败' });
                  }
                })
              }} />
            } else {
              return <Fragment>
                <Popconfirm title="确定同步这个备份到线上?" icon={<WarningOutlined />} onConfirm={() => {
                  if (process.env.NODE_ENV !== 'development') {
                    return notification.error({ message: '线上环境这个命令无效' })
                  }
                  syncBackup2prod(record).then(res => {
                    if (res.code === 0) {
                      notification.success({ message: '操作成功' });
                    } else {
                      notification.error({ message: '操作失败' });
                    }
                  })
                }}>
                  <UploadOutlined title="同步备份文件夹到线上" />
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm title="确定下载这个备份的zip?" icon={<WarningOutlined />} onConfirm={() => {
                  downloadBackup2zip(record).then(res => {
                    if (res.code === 0) {
                      search();
                      // TODO: download
                      window.open(res.data.url, '_blank')
                    } else {
                      notification.error({ message: '操作失败' });
                    }
                  })
                }}>
                  <CloudDownloadOutlined title="下载备份文件夹的zip" />
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm title="确定恢复这个备份?" icon={<WarningOutlined />} onConfirm={() => {
                  recoveryByBackup(record).then(res => {
                    if (res.code === 0) {
                      notification.success({ message: '操作成功' });
                    } else {
                      notification.error({ message: '操作失败' });
                    }
                  })
                }}>
                  <HddOutlined title="按文件夹恢复数据库" />
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm title="确定?" icon={<WarningOutlined />} onConfirm={() => { destroyBackup({ dir: record.dir }).then(() => search()) }}>
                  <DeleteOutlined />
                </Popconfirm>
              </Fragment>
            }
          }} />
        </Table>
      </FullHeightAuto>
    </FullHeight>

  )}</Observer>
}