import React, { useCallback, } from 'react';
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider, Tabs, } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined, } from '@ant-design/icons'
import apis from '../../../api'
import { Right, Padding } from '../../../component/style'
import { useEffectOnce } from 'react-use';
import md5 from 'js-md5'
import { events } from '../../../utils/events'

const { TabPane } = Tabs;
const { Column } = Table;
export default function ConfigPage() {
    // const lb = { span: 3 }, rb = { span: 18 }
    const local = useLocalStore(() => ({
        robots: [],
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
            local.robots = res.data
        }
        local.initing = false
    }, [])

    useEffectOnce(() => {
        function fn({ uin, action }) {
            const robot = local.robots.find(robot => robot.uin === uin + '')
            if (robot) {
                if (action === 'online') {
                    robot.isLogin = true
                } else if (action === 'offline') {
                    robot.isLogin = false
                    robot.friends = []
                    robot.groups = []
                    robot.discuss = []
                }
            }
        }
        events.on('qqSystem', fn)
        getRobots()
        return () => {
            events.off('qqSystem', fn)
        }
    })
    return <Observer>{() => (
        <Padding>
            <Right>
                <Button type="primary" disabled={local.loading} loading={local.loading} onClick={async () => {
                    try {
                        const uin = prompt('帐号')
                        if (uin) {
                            const pass = prompt('密码')
                            if (pass) {
                                local.loading = true
                                const params = { uin, cmd: 'signin' }
                                const data = { pass: md5(pass) }
                                await apis.sendRobotCMD({ params, data })
                                notification.info({ message: '发送命令成功' })
                                getRobots()
                            }
                        }
                    } catch (e) {
                        notification.info(e.message)
                    } finally {
                        local.loading = false
                    }
                }}>新增</Button>
                <Divider type="vertical" />
                <Button type="primary" loading={local.loading || local.initing} onClick={() => {
                    getRobots()
                }}>刷新</Button>
            </Right>
            {local.robots.length === 0 && <div>还没有机器人在线，添加一个试试</div>}
            <Tabs defaultActiveKey="1" >
                {local.robots.map(({ uin, isLogin, friends, groups, discuss }, i) => <TabPane tab={uin} key={i}>
                    <Padding>
                        <Button type="primary" disabled={isLogin || local.loading} onClick={async () => {
                            const input = prompt('请输入密码')
                            if (!input) {
                                return
                            }
                            const params = { uin, cmd: 'signin' }
                            const data = { pass: md5(input) }
                            try {
                                local.loading = true
                                await apis.sendRobotCMD({ params, data })
                                notification.info({ message: '发送命令成功' })
                            } catch (e) {
                                notification.info({ message: e.message })
                            } finally {
                                local.loading = false
                            }
                        }}>登陆</Button>
                        <Divider type="vertical" />
                        <Button type="primary" disabled={isLogin || local.loading} onClick={async () => {
                            const ticket = prompt('请输入ticket')
                            if (!ticket) {
                                return
                            }
                            const params = { uin, cmd: 'sliderLogin' }
                            const data = { ticket }
                            try {
                                local.loading = true
                                await apis.sendRobotCMD({ params, data })
                                notification.info({ message: '发送命令成功' })
                            } catch (e) {
                                notification.info({ message: e.message })
                            } finally {
                                local.loading = false
                            }
                        }}>滑动登陆</Button>
                        <Divider type="vertical" />
                        <Button type="primary" disabled={isLogin || local.loading} onClick={async () => {
                            const captcha = prompt('请输入验证码')
                            if (!captcha) {
                                return
                            }
                            const params = { uin, cmd: 'captchaLogin' }
                            const data = { captcha }
                            try {
                                local.loading = true
                                await apis.sendRobotCMD({ params, data })
                                notification.info({ message: '发送命令成功' })
                            } catch (e) {
                                notification.info({ message: e.message })
                            } finally {
                                local.loading = false
                            }
                        }}>验证码登陆</Button>
                        <Divider type="vertical" />
                        <Button type="primary" disabled={!isLogin || local.loading} onClick={async () => {
                            const params = { uin, cmd: 'logout' }
                            try {
                                local.loading = true
                                await apis.sendRobotCMD({ params })
                                notification.info({ message: '发送命令成功' })
                            } catch (e) {
                                notification.info({ message: e.message })
                            } finally {
                                local.loading = false
                            }

                        }}>退出</Button>
                        <Divider type="vertical" />
                        <Button type="primary" disabled={!isLogin || local.loading} onClick={async () => {
                            const params = { uin }
                            const uid = prompt('输入号码')
                            if (!uid) {
                                return
                            }
                            const data = { uin: uid, type: 'friend' }
                            try {
                                local.loading = true
                                const result = await apis.addFriend({ params, data })
                                notification.info({ message: '发送命令成功' })
                            } catch (e) {
                                notification.info({ message: e.message })
                            } finally {
                                local.loading = false
                            }
                        }}>添加好友</Button>
                        <Divider type="vertical" />
                        <Button type="primary" disabled={!isLogin || local.loading} onClick={async () => {
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
                    <Table pagination={false} dataSource={friends} rowKey="user_id" scroll={{ y: 'calc(100vh - 300px)' }} loading={local.initing} >
                        <Column title="uin" width={120} dataIndex="user_id" key="user_id" />
                        <Column title="备注" dataIndex="remark" key="remark" />
                        <Column title="昵称" dataIndex="nickname" key="nickname" />
                        <Column title="操作" dataIndex="action" key="action" align="center" render={(text, record) => (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <FormOutlined onClick={async () => {
                                    const message = prompt('输入要说的话')
                                    if (!message) {
                                        return
                                    }
                                    const params = { uin }
                                    const data = { uin: record.user_id, message, type: 'friend' }
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
                                    const params = { uin }
                                    const data = { uin: record.user_id, type: 'friend' }
                                    try {
                                        local.loading = true
                                        const result = await apis.removeFriend({ params, data })
                                        notification.info({ message: '发送命令成功' })
                                    } catch (e) {
                                        notification.info({ message: e.message })
                                    } finally {
                                        local.loading = false
                                    }
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