import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider, Input } from 'antd';
import { DeleteOutlined, WarningOutlined, HddOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, padding } from '../../../component/style'
import Modal from 'antd/lib/modal/Modal';

const { getTableBackups, createTableBackup, destroyTableBackup } = apis
const { Column } = Table;

export default function TaskList() {
    const local = useLocalStore(() => ({
        isLoading: false,
        isStoring: false,
        backups: [],
        showModal: false,
    }))
    const search = useCallback(() => {
        local.isLoading = true
        const query = {
            resource_id: local.resource_id,
            page: local.search_page,
        }
        getTableBackups(query).then(res => {
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
                        try {
                            local.isStoring = true
                            const res = await createTableBackup({})
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
                    }}>创建备份</Button>
                    <Divider type="vertical" />
                    <Button onClick={search}>刷新</Button>
                </Right>
            </FullHeightFix>
            <FullHeightAuto>
                <Table dataSource={local.backups} rowKey="dir" pagination={false} loading={local.isLoading}>
                    <Column title="备份" dataIndex="dir" key="dir" render={(text, record) => {
                        return record.type === 'json' ? text + '.json' : text
                    }} />
                    <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => {
                        return <Fragment>
                            <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => { destroyTableBackup({ dir: record.type === 'json' ? record.dir + '.json' : record.dir }).then(() => search()) }}>
                                <DeleteOutlined />
                            </Popconfirm>
                        </Fragment>
                    }} />
                </Table>
            </FullHeightAuto>
        </FullHeight>
    )}</Observer>
}