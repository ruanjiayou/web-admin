import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider, Input, Upload, message, Popover, } from 'antd';
import { DeleteOutlined, WarningOutlined, HddOutlined, ArrowLeftOutlined, ScanOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import apis from '../../../api'
import store from '../../../store'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, padding } from '../../../component/style'
import { VisualBox } from '../../../component'
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode'

const { getFiles, createFile, destroyFile } = apis
const { Column } = Table;

export default function TaskList() {
    const local = useLocalStore(() => ({
        isLoading: false,
        showModal: false,
        dirpath: '/',
        tempname: '',
        uploading: false,
        files: [],
    }))
    const search = useCallback(() => {
        local.isLoading = true
        getFiles({ param: local.dirpath }).then(res => {
            local.isLoading = false
            local.files = res.data.sort((a, b) => {
                return b.dir ? 1 : -1
            })
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
                    <Upload
                        showUploadList={false}
                        name="file"
                        disabled={local.uploading}
                        onChange={async (e) => {
                            local.uploading = true
                            console.log(e)
                            try {
                                const res = await createFile({
                                    isdir: '',
                                    param: local.dirpath,
                                    name: e.file.name,
                                    upfile: e.file
                                })
                                if (res.code === 0) {
                                    message.info('上传成功')
                                } else {
                                    message.info(res.message || '上传失败')
                                }
                            } catch (e) {
                                message.error(e.message)
                            } finally {
                                local.uploading = false
                            }
                        }}
                        beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>上传</Button>
                    </Upload>
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
                        const res = await createFile({ name: local.tempname })
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
                <Input defaultValue={local.tempname} autoFocus onChange={e => {
                    local.tempname = e.target.value
                }} />
            </Modal>
            <FullHeightAuto>
                <Table dataSource={local.files} rowKey="name" scroll={{ y: 'calc(100vh - 180px)' }} pagination={false} loading={local.isLoading}>
                    <Column title={<span>{local.dirpath !== '/' && <ArrowLeftOutlined onClick={() => {
                        const sp = local.dirpath.substr(1, local.dirpath.length - 2).split('/')
                        sp.pop();
                        local.dirpath = '/' + sp.join('/')
                        search()
                    }} />}文件名</span>} dataIndex="name" key="name" render={(text, record) => {
                        return record.dir ? <Link to={''} onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            local.dirpath += text + '/';
                            search()
                        }}>{text}</Link> : text;
                    }} />
                    <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => {
                        const filepath = store.app.baseUrl + '/v1/public/share-file' + local.dirpath + record.name
                        return <Fragment>
                            <VisualBox visible={record.dir === false}>
                                <Popconfirm icon={null} title={<QRCode style={{ marginLeft: -22 }} value={filepath} />} okText='打开' cancelText='取消' onConfirm={() => {
                                    window.open(filepath, '_blank');
                                }}>
                                    <ScanOutlined />
                                </Popconfirm>
                                {/* <Divider type="vertical" />
                                <DownloadOutlined title={filepath} onClick={() => {
                                    
                                }} /> */}
                                <Divider type="vertical" />
                                <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
                                    destroyFile({ param: local.dirpath + record.name }).then(() => search())
                                }}>
                                    <DeleteOutlined />
                                </Popconfirm>
                            </VisualBox>
                        </Fragment>
                    }} />
                </Table>
            </FullHeightAuto>
        </FullHeight>
    )}</Observer>
}