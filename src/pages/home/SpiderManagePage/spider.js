import _ from 'lodash'
import React, { useState, useCallback, } from 'react';
import { useEffectOnce } from 'react-use';
import { Button, Space, Table, notification, Popconfirm, Modal, Select, Input, Form, Switch, Divider, } from 'antd';
import { Observer, useLocalStore, } from 'mobx-react-lite';
import styled from 'styled-components';
import { Icon } from '../../../component'
import { match } from 'path-to-regexp'
import apis from '../../../api';
import EditPage from './spider-edit'
import CodeEditor from '../../../component/CodeEditor';

const Wrap = styled.div`
  margin: ${props => props.size === 'small' ? 5 : (props.size === 'large' ? 15 : 10)}px;
`
const IconWrap = styled.span`
  &:hover {
    color: ${props => props.color || '#38b1eb'};
    cursor: pointer;
  }
  &>svg {
    width: ${props => props.size || 16}px;
    height:${props => props.size || 16}px;
  }
`
const RuleStatus = {
    0: { text: '开发中', color: 'blue' },
    1: { text: "使用中", color: 'green' },
    2: { text: "已废弃", color: "red" },
    3: { text: "待上线", color: "#cad100" },
}

export default function RulePage(props) {
    const [form] = Form.useForm()
    const local = useLocalStore(() => ({
        tempData: {},
        spiders: [],
        page: 1,
        limit: 20,
        loading: false,
        preview: false,
        matchURL: {
            open: false,
            loading: false,
            url: '',
            matched_spider_id: '',
            params: null,
            isComposition: false,
        },
        setData(spiders) {
            this.spiders = spiders;
        }
    }))
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffectOnce(() => {
        getSpiders()
        return () => {

        }
    })
    const editData = async (data) => {
        local.tempData = data;
        setIsModalOpen(true);
    }
    const getSpiders = async () => {
        local.loading = true;
        const result = await apis.getSpiders({ page: local.page, limit: local.limit })
        if (result.code === 0) {
            result.data.forEach(it => {
                it.origin = new URL(it.pattern).origin;
            })
            local.spiders = result.data.sort((a, b) => a.status === 2 ? 1 : -1);
        } else {
            notification.error({ message: '获取数据失败' })
        }
        local.loading = false;
    }
    function openMatch() {
        local.matchURL.matched_spider_id = '';
        local.matchURL.url = '';
        local.matchURL.open = true;
        local.matchURL.isComposition = false;
        local.matchURL.params = null;
    }
    function closeMatch() {
        local.matchURL.params = null;
        form.setFieldsValue({ url: '' })
        local.matchURL.open = false;
    }
    const onCrawl = async () => {
        local.matchURL.loading = true
        try {
            const result = await apis.patchSpider(local.matchURL.matched_spider_id, { url: local.matchURL.url, params: local.matchURL.params }, local.preview)
            form.setFieldsValue({ url: '' })
            local.matchURL.open = false
            console.log(result);
            if (local.preview) {
                Modal.confirm({
                    title: '预览结果',
                    okText: '确定',
                    cancelButtonProps: { hidden: true },
                    width: 700,
                    content: <CodeEditor
                        value={JSON.stringify(result.data, null, 2)}
                        onChange={value => { }}
                    />
                })
            }
        } catch (e) {

        } finally {
            local.matchURL.loading = false;
        }
    }
    const matchUrl = (link) => {
        if (!link || !link.startsWith('http')) {
            return null;
        }
        const url1 = new window.URL(encodeURI(link))
        let found = null;
        for (let i = 0; i < local.spiders.length; i++) {
            const spider = local.spiders[i];
            const url_pattern = spider.pattern;
            const url2 = new window.URL(encodeURI(url_pattern));
            if (url_pattern.startsWith(url1.origin)) {
                console.log(decodeURI(url2.pathname))
                const fn = match(decodeURI(url2.pathname), { decode: decodeURIComponent })
                const result = fn(decodeURI(url1.pathname))
                console.log(result, decodeURI(url1.pathname));
                if (result.params) {
                    found = result.params;
                    [...url2.searchParams.entries()].forEach(([key, value]) => {
                        if (value.startsWith(':')) {
                            value = url1.searchParams.get(key).substring(1);
                            found[key] = value;
                        }
                    })
                    local.matchURL.url = link;
                    local.matchURL.matched_spider_id = spider._id;
                    local.matchURL.params = found
                    break;
                }
            }
            if (found) {
                break;
            }
        }
    }
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: "_id",
            render: (text, record) => <a href={record.origin} target='_blank'>{text}</a>,
        },
        {
            title: '标识',
            dataIndex: '_id',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: '_id',
            render: (status) => <span style={{ color: RuleStatus[status].color }} >{RuleStatus[status].text}</span>
        },
        {
            title: '匹配规则',
            key: 'pattern',
            dataIndex: 'pattern',
        },
        {
            title: '操作',
            key: '_id',
            render: (_, record) => (
                <Space size="middle">
                    <IconWrap>
                        <Icon type="edit" onClick={() => {
                            editData(record);
                        }} />
                    </IconWrap>
                    <Popconfirm
                        title="提示"
                        description="确定要删除吗?"
                        onConfirm={async () => {
                            try {
                                await apis.destroyRule(record)
                                await getSpiders()
                            } catch (e) {
                                notification.error({ message: '删除失败' })
                            }
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <IconWrap>
                            <Icon type="delete" />
                        </IconWrap>
                    </Popconfirm>
                </Space>
            ),
        },
    ]
    return <Observer>{() => (<div>
        <Wrap size="middle">
            <Space size={"small"}>
                <Button type="primary" onClick={() => { local.tempData = {}; setIsModalOpen(true) }}>添加</Button>
                <Button type='primary' onClick={openMatch}>抓取</Button>
                <Button type="primary">
                    <Icon type="sync-horizon" spin={local.loading} onClick={() => getSpiders()} color="#blue" />
                </Button>
            </Space>
            {isModalOpen && <EditPage cancel={() => setIsModalOpen(false)} data={local.tempData} save={async (data) => {
                const result = local.tempData._id ? await apis.updateSpider(local.tempData._id, data) : await apis.createSpider(data)
                if (result.code === 0) {
                    await getSpiders()
                    notification.info({ message: '保存成功' });
                    setIsModalOpen(false);
                } else {
                    notification.warning({ message: result.message })
                }
            }} />}
        </Wrap>
        <Table columns={columns} dataSource={local.spiders} rowKey="_id" pagination={false} />
        <Modal
            visible={local.matchURL.open}
            footer={<Space>
                <Button onClick={closeMatch}>取消</Button>
                <Button
                    loading={local.matchURL.loading}
                    type="primary"
                    disabled={local.matchURL.matched_spider_id === ''}
                    onClick={onCrawl}
                >抓取</Button>
            </Space>}
            onCancel={closeMatch}
        >
            <Form form={form}>
                <Form.Item label="规则" labelCol={{ span: 2 }} style={{ marginTop: 32 }} >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Select disabled value={local.matchURL.matched_spider_id} style={{ flex: 1 }}>
                            <Select.Option value="">无</Select.Option>
                            {local.spiders.map(spider => (<Select.Option key={spider._id} value={spider._id}>{spider.name}</Select.Option>))}
                        </Select>
                        &nbsp;
                        <Switch checked={local.preview} onChange={v => local.preview = v} />&nbsp;预览
                    </div>
                </Form.Item>
                <Form.Item label="地址" labelCol={{ span: 2 }} name="url">
                    <Input
                        autoFocus
                        onPaste={(e) => {
                            matchUrl(e.target.value)
                        }}
                        onChange={(e) => {
                            if (!local.matchURL.isComposition) {
                                matchUrl(e.target.value)
                            }
                        }}
                        onCompositionStart={() => {
                            local.matchURL.isComposition = true
                        }}
                        onCompositionEnd={(e) => {
                            local.matchURL.isComposition = false
                            matchUrl(e.target.value)
                        }} />
                </Form.Item>
            </Form>
        </Modal>
    </div>)
    }</Observer >;
}