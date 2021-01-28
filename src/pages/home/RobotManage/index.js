import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider, Input, Tabs, Form } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined, CloudServerOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, Padding } from '../../../component/style'
import { useEffectOnce } from 'react-use';
import md5 from 'js-md5'

const { TabPane } = Tabs;
const { Column } = Table;
export default function ConfigPage() {
    const lb = { span: 3 }, rb = { span: 18 }
    const local = useLocalStore(() => ({
        robots: [],
        friends: [],
        groups: [],
        loading: false,
        initing: false,
    }))
    const init = useCallback(async () => {
        local.initing = true
        const res = await apis.getFriends()
        if (res && res.code === 0) {
            local.friends = res.data;
        }
        local.initing = false
    }, [])

    const getRobots = useCallback(async () => {
        local.initing = true
        const res = await apis.getRobots()
        if (res.code === 0) {
            local.robots = res.data.map(robot => ({ friends: [], groups: [], ...robot }))
        }
        local.initing = false
    }, [])

    useEffectOnce(() => {
        getRobots()
    })
    return <Observer>{() => (
        <Padding>
            <Button type="primary" loading={local.loading} onClick={() => {
                getRobots()
            }}>刷新</Button>
            <Tabs defaultActiveKey="1" >
                {local.robots.map(({ uin, detail, friends, groups }, i) => <TabPane tab={uin} key={i}>
                    <Padding>
                        <Button type="primary" disabled={detail.isLogin || local.loading} onClick={async () => {
                            const input = prompt('请输入密码')
                            if (!input) {
                                return
                            }
                            const params = { uin, cmd: 'signin' }
                            const data = { pass: md5(input) }
                            try {
                                local.loading = true
                                await apis.sendRobotCMD({ params, data })
                                detail.isLogin = true
                                notification.info({ message: '发送命令成功' })
                            } catch (e) {
                                notification.info({ message: e.message })
                            } finally {
                                local.loading = false
                            }
                        }}>登陆</Button>
                        <Divider type="vertical" />
                        <Button type="primary" disabled={!detail.isLogin || local.loading} onClick={async () => {
                            const params = { uin, cmd: 'logout' }
                            try {
                                local.loading = true
                                await apis.sendRobotCMD({ params })
                                detail.isLogin = false
                                notification.info({ message: '发送命令成功' })
                            } catch (e) {
                                notification.info({ message: e.message })
                            } finally {
                                local.loading = false
                            }

                        }}>退出</Button>
                        <Divider type="vertical" />
                        <Button type="primary" disabled={!detail.isLogin || local.loading}>{detail.online ? '在线' : '离线'}</Button>
                        <Divider type="vertical" />
                        <Button type="primary" disabled={!detail.isLogin || local.loading} onClick={async () => {
                            const params = { uin }
                            try {
                                local.loading = true
                                const result = await apis.getFriends({ params })
                                if (result.code === 0) {
                                    const robot = local.robots.find(robot => robot.uin === uin)
                                    if (robot) {
                                        robot.friends = result.data
                                    }
                                }
                                notification.info({ message: '发送命令成功' })
                            } catch (e) {
                                notification.info({ message: e.message })
                            } finally {
                                local.loading = false
                            }

                        }}>刷新列表</Button>
                        <Divider type="vertical" />
                    </Padding>
                    <Table dataSource={friends} rowKey="user_id" scroll={{ y: 'calc(100vh - 300px)' }} loading={local.initing} pagination={{
                        pageSize: 20,
                    }}>
                        <Column title="uin" width={100} dataIndex="user_id" key="user_id" />
                        <Column title="备注" dataIndex="remark" key="remark" />
                        <Column title="昵称" dataIndex="nickname" key="nickname" />
                        <Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <FormOutlined onClick={async () => {
                                    const message = prompt('输入要说的话')
                                    if (!message) {
                                        return
                                    }
                                    const params = { uin }
                                    const data = { uin: record.user_id, message }
                                    try {
                                        local.loading = true
                                        const result = await apis.sendRobotMsg({ params, data })
                                        if (result.code === 0) {
                                            notification.info({ message: '发送命令成功' })
                                        } else {
                                            notification.error({ message: '发送命令失败' })
                                        }
                                    } catch (e) {
                                        notification.info({ message: e.message })
                                    } finally {
                                        local.loading = false
                                    }
                                }} />
                                <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {

                                }}>
                                    <DeleteOutlined />
                                </Popconfirm>
                            </div>
                        )} />
                    </Table>
                </TabPane>)}
            </Tabs>
        </Padding>
    )}</Observer>
}