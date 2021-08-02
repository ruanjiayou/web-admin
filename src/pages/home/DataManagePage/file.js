import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider, Input, Upload, message, } from 'antd';
import { DeleteOutlined, WarningOutlined, ArrowLeftOutlined, ScanOutlined, UploadOutlined, CheckOutlined, FormOutlined, LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons'
import apis from '../../../api'
import store from '../../../store'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, padding } from '../../../component/style'
import { VisualBox } from '../../../component'
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode'
import { HoverTitle } from './file.style'

const { getFiles, createFile, destroyFile, renameFile } = apis
const { Column } = Table;

export default function TaskList() {
    const local = useLocalStore(() => ({
        isLoading: false,
        showModal: false,
        dirpath: '/',
        tempname: '',
        isDir: 0,
        uploading: false,
        files: [],
    }))
    const nameRef = useRef(null)
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
                            try {
                                const res = await createFile({
                                    isdir: 0,
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
                    <Button onClick={() => {
                        local.showModal = true
                        setTimeout(() => {
                            nameRef.current && nameRef.current.input.focus()
                        }, 300)
                    }}>创建文件夹</Button>
                    <Divider type="vertical" />
                    <Button onClick={search}>刷新</Button>
                </Right>
            </FullHeightFix>
            <Modal
                visible={local.showModal}
                okText="创建"
                cancelText="取消"
                closable={false}
                style={{ top: window.screen.height / 2 + 'px', transform: 'translate(0, -50%)' }}
                onCancel={() => local.showModal = false}
                onOk={async () => {
                    const oinput = nameRef.current.input
                    if (oinput.value.trim()) {
                        let dirname = oinput.value.trim()
                        try {
                            local.isLoading = true
                            const res = await createFile({ isDir: 1, param: local.dirpath, name: dirname })
                            if (res && res.code === 0) {
                                oinput.value = ''
                                nameRef.current.state.value = ''
                                local.showModal = false
                                search()
                                notification.success({ message: '创建成功' });
                            } else {
                                notification.error({ message: '创建失败' });
                            }
                        } catch (e) {
                            notification.error({ message: '请求失败' });
                        } finally {
                            local.isLoading = false
                        }
                    } else {
                        message.info('名称不合法', 2)
                    }
                }}
            >
                <Input defaultValue={''} disabled={local.isLoading} ref={ref => nameRef.current = ref} autoFocus />
            </Modal>
            <FullHeightAuto>
                <Table dataSource={local.files} rowKey="name" scroll={{ y: 'calc(100vh - 180px)' }} pagination={false} loading={local.isLoading}>
                    <Column title={<span>{local.dirpath !== '/' && <ArrowLeftOutlined onClick={() => {
                        const sp = local.dirpath.substr(1, local.dirpath.length - 2).split('/')
                        sp.pop();
                        local.dirpath = '/' + sp.join('/')
                        search()
                    }} />}文件名</span>} dataIndex="name" key="name" render={(text, record) => {
                        return <Observer>{() => {
                            if (record.dir) {
                                return <Link to={''} onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    local.dirpath += text + '/';
                                    search()
                                }}>{text}</Link>
                            } else if (record.editing) {
                                return <Input
                                    defaultValue={text}
                                    disabled={record.isLoading}
                                    autoFocus
                                    addonAfter={record.isLoading ? <LoadingOutlined /> : <div>
                                        <CheckOutlined onClick={async (e) => {
                                            const o = e.currentTarget.parentNode.parentNode.previousSibling
                                            record.isLoading = true
                                            try {
                                                await renameFile({ dirpath: local.dirpath, oldname: text, newname: o.value })
                                                search()
                                                record.editing = false
                                            } catch (e) {
                                                message.info(e.message)
                                            } finally {
                                                record.isLoading = false
                                            }
                                        }} />
                                        <Divider type="vertical" />
                                        <CloseCircleOutlined onClick={() => record.editing = false} />
                                    </div>} />
                            } else {
                                return <HoverTitle>{text} <FormOutlined onClick={() => record.editing = true} /></HoverTitle>
                            }
                        }}</Observer>
                    }} />
                    <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => {
                        const filepath = store.app.baseUrl + '/v1/public/share-file' + local.dirpath + record.name
                        return <Fragment>
                            <VisualBox visible={record.dir === true}>
                                <Popconfirm title={`确定删除 ${record.name} 所有子文件?`} okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
                                    destroyFile({ param: local.dirpath + record.name, isDir: 1 }).then(() => search())
                                }}>
                                    <DeleteOutlined />
                                </Popconfirm>
                            </VisualBox>
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