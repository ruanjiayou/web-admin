import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider, Input } from 'antd';
import { DeleteOutlined, WarningOutlined, HddOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, padding } from '../../../component/style'
import { VisualBox } from '../../../component'
import Modal from 'antd/lib/modal/Modal';

const { getBackups, createBackup, destroyBackup, recoveryByBackup } = apis
const { Column } = Table;

export default function TaskList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    isStoring: false,
    backups: [],
    showModal: false,
    backupName: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}-automation`,
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
      <FullHeightFix style={padding}>
        <Right>
          <Button type="primary" loading={local.isStoring} disabled={local.isLoading || local.isStoring} onClick={async (e) => {
            local.showModal = true
          }}>创建备份</Button>
          <Divider type="vertical" />
          <Button onClick={search}>刷新</Button>
        </Right>
      </FullHeightFix>
      <Modal
        visible={local.showModal}
        okText="创建"
        cancelText="取消"
        style={{ top: window.screen.height / 2 + 'px', transform: 'translate(0, -50%)' }}
        onCancel={() => local.showModal = false}
        onOk={async () => {
          local.showModal = false
          try {
            local.isStoring = true
            const res = await createBackup({ name: local.backupName })
            if (res && res.code === 0) {
              search()
              notification.success({ message: '创建成功' });
            } else {
              notification.error({ message: '创建失败' });
            }
          } catch (e) {
            notification.error({ message: '请求失败' });
          } finally {
            local.isStoring = false
          }
        }}
      >
        <Input defaultValue={local.backupName} autoFocus onChange={e => {
          local.backupName = e.target.value
        }} />
      </Modal>
      <FullHeightAuto>
        <Table dataSource={local.backups} rowKey="dir" pagination={false} loading={local.isLoading}>
          <Column title="备份" dataIndex="dir" key="dir" render={(text, record) => {
            return record.type === 'zip' ? text + '.zip' : text
          }} />
          <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => {
            return <Fragment>
              <VisualBox visible={record.type === 'dir'}>
                <Popconfirm title="确定恢复这个备份?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
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
              </VisualBox>
              <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => { destroyBackup({ dir: record.type === 'zip' ? record.dir + '.zip' : record.dir }).then(() => search()) }}>
                <DeleteOutlined />
              </Popconfirm>
            </Fragment>
          }} />
        </Table>
      </FullHeightAuto>
    </FullHeight>
  )}</Observer>
}